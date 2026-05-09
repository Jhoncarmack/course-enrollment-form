"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import CourseStep from "@/components/CourseStep";
import ApplicantStep from "@/components/ApplicantStep";
import ConfirmStep from "@/components/ConfirmStep";
import CompletionPage from "@/components/CompletionPage";
import Footer from "@/components/Footer";
import { submitEnrollment } from "@/lib/api";
import { validateApplicantInfo, validateGroupInfo } from "@/lib/validations";

import type { Course } from "@/types/course";
import type {
   ApplicantInfo,
   EnrollmentRequest,
   EnrollmentResponse,
   EnrollmentType,
   ErrorResponse,
   GroupInfo,
} from "@/types/enrollment";
import type { ApplicantErrors, GroupErrors } from "@/lib/validations";
import { findFirstErrorFieldId, focusFieldById } from "@/lib/focusError";

type Step = 1 | 2 | 3;
const DRAFT_STORAGE_KEY = "course-enrollment-form-draft";

interface EnrollmentDraft {
   currentStep: Step;
   selectedCourse: Course | null;
   enrollmentType: EnrollmentType;
   applicant: ApplicantInfo;
   groupInfo: GroupInfo;
   agreedToTerms: boolean;
}
const initialApplicant: ApplicantInfo = {
   name: "",
   email: "",
   phone: "",
   motivation: "",
};

function createInitialGroupInfo(): GroupInfo {
   return {
      organizationName: "",
      headCount: 2,
      participants: [
         { name: "", email: "" },
         { name: "", email: "" },
      ],
      contactPerson: "",
   };
}

function hasGroupInfoValue(groupInfo: GroupInfo) {
   return (
      groupInfo.organizationName.trim() ||
      groupInfo.contactPerson.trim() ||
      groupInfo.participants.some(
         (participant) => participant.name.trim() || participant.email.trim(),
      )
   );
}

function createApplicantPayload(applicant: ApplicantInfo) {
   const motivation = applicant.motivation.trim();

   return {
      name: applicant.name.trim(),
      email: applicant.email.trim(),
      phone: applicant.phone.trim(),
      ...(motivation ? { motivation } : {}),
   };
}
function hasApplicantValue(applicant: ApplicantInfo) {
   return (
      applicant.name.trim() ||
      applicant.email.trim() ||
      applicant.phone.trim() ||
      applicant.motivation.trim()
   );
}

export default function Home() {
   const [currentStep, setCurrentStep] = useState<Step>(1);
   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
   const [enrollmentType, setEnrollmentType] =
      useState<EnrollmentType>("personal");
   const [applicant, setApplicant] = useState<ApplicantInfo>(initialApplicant);
   const [groupInfo, setGroupInfo] = useState<GroupInfo>(
      createInitialGroupInfo,
   );
   const [applicantErrors, setApplicantErrors] = useState<ApplicantErrors>({});
   const [groupErrors, setGroupErrors] = useState<GroupErrors>({});
   const [agreedToTerms, setAgreedToTerms] = useState(false);
   const [enrollmentResult, setEnrollmentResult] =
      useState<EnrollmentResponse | null>(null);
   const [isDraftLoaded, setIsDraftLoaded] = useState(false);
   const shouldWarnBeforeLeave =
      isDraftLoaded &&
      !enrollmentResult &&
      (selectedCourse !== null ||
         hasApplicantValue(applicant) ||
         hasGroupInfoValue(groupInfo) ||
         agreedToTerms ||
         currentStep !== 1);
   useEffect(() => {
      const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);

      if (!savedDraft) {
         setIsDraftLoaded(true);
         return;
      }

      try {
         const parsedDraft = JSON.parse(savedDraft) as EnrollmentDraft;

         setCurrentStep(parsedDraft.currentStep);
         setSelectedCourse(parsedDraft.selectedCourse);
         setEnrollmentType(parsedDraft.enrollmentType);
         setApplicant(parsedDraft.applicant);
         setGroupInfo(parsedDraft.groupInfo);
         setAgreedToTerms(parsedDraft.agreedToTerms);
      } catch {
         window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } finally {
         setIsDraftLoaded(true);
      }
   }, []);

   useEffect(() => {
      if (!isDraftLoaded || enrollmentResult) {
         return;
      }

      const draft: EnrollmentDraft = {
         currentStep,
         selectedCourse,
         enrollmentType,
         applicant,
         groupInfo,
         agreedToTerms,
      };

      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
   }, [
      isDraftLoaded,
      enrollmentResult,
      currentStep,
      selectedCourse,
      enrollmentType,
      applicant,
      groupInfo,
      agreedToTerms,
   ]);
   useEffect(() => {
      if (!shouldWarnBeforeLeave) {
         return;
      }

      function handleBeforeUnload(event: BeforeUnloadEvent) {
         event.preventDefault();
         event.returnValue = "";
      }

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
         window.removeEventListener("beforeunload", handleBeforeUnload);
      };
   }, [shouldWarnBeforeLeave]);
   const enrollmentMutation = useMutation<
      EnrollmentResponse,
      ErrorResponse,
      EnrollmentRequest
   >({
      mutationFn: submitEnrollment,
      onSuccess: (data) => {
         window.localStorage.removeItem(DRAFT_STORAGE_KEY);
         setEnrollmentResult(data);
      },
   });

   function handleChangeEnrollmentType(type: EnrollmentType) {
      if (
         enrollmentType === "group" &&
         type === "personal" &&
         hasGroupInfoValue(groupInfo)
      ) {
         const confirmed = window.confirm(
            "개인 신청으로 변경하면 입력한 단체 신청 정보가 초기화됩니다. 변경하시겠습니까?",
         );

         if (!confirmed) {
            return;
         }

         setGroupInfo(createInitialGroupInfo());
         setGroupErrors({});
      }

      setEnrollmentType(type);
   }

   function goToNextFromCourse() {
      if (!selectedCourse) {
         return;
      }

      setCurrentStep(2);
   }

   function goToNextFromApplicant() {
      const nextApplicantErrors = validateApplicantInfo(applicant);
      const nextGroupErrors =
         enrollmentType === "group" ? validateGroupInfo(groupInfo) : {};

      setApplicantErrors(nextApplicantErrors);
      setGroupErrors(nextGroupErrors);

      if (
         Object.keys(nextApplicantErrors).length > 0 ||
         Object.keys(nextGroupErrors).length > 0
      ) {
         const firstErrorId = findFirstErrorFieldId(
            nextApplicantErrors,
            nextGroupErrors,
            enrollmentType === "group",
         );
         if (firstErrorId) {
            // setState 반영 후 DOM이 업데이트되면 포커스 이동
            setTimeout(() => focusFieldById(firstErrorId), 0);
         }
         return;
      }

      setCurrentStep(3);
   }

   function buildEnrollmentRequest(): EnrollmentRequest | null {
      if (!selectedCourse) {
         return null;
      }

      const applicantPayload = createApplicantPayload(applicant);

      if (enrollmentType === "personal") {
         return {
            courseId: selectedCourse.id,
            type: "personal",
            applicant: applicantPayload,
            agreedToTerms,
         };
      }

      return {
         courseId: selectedCourse.id,
         type: "group",
         applicant: applicantPayload,
         group: {
            organizationName: groupInfo.organizationName.trim(),
            headCount: groupInfo.headCount,
            participants: groupInfo.participants
               .slice(0, groupInfo.headCount)
               .map((participant) => ({
                  name: participant.name.trim(),
                  email: participant.email.trim(),
               })),
            contactPerson: groupInfo.contactPerson.trim(),
         },
         agreedToTerms,
      };
   }

   function handleEditStep(step: Step) {
      enrollmentMutation.reset();
      if (step === 1) {
         setApplicantErrors({});
         setGroupErrors({});
      }
      setCurrentStep(step);
   }
   function handleClearApplicantError(field: keyof ApplicantInfo) {
      setApplicantErrors((prev) => {
         if (!prev[field]) {
            return prev;
         }
         const next = { ...prev };
         delete next[field];
         return next;
      });
   }
   function handleSetApplicantError(
      field: keyof ApplicantInfo,
      message: string | undefined,
   ) {
      setApplicantErrors((prev) => {
         if (message === undefined) {
            if (!prev[field]) {
               return prev;
            }
            const next = { ...prev };
            delete next[field];
            return next;
         }
         if (prev[field] === message) {
            return prev;
         }
         return { ...prev, [field]: message };
      });
   }
   function handleClearGroupError(key: string) {
      setGroupErrors((prev) => {
         if (!prev[key]) {
            return prev;
         }
         const next = { ...prev };
         delete next[key];
         return next;
      });
   }

   function handleSetGroupError(key: string, message: string | undefined) {
      setGroupErrors((prev) => {
         if (message === undefined) {
            if (!prev[key]) {
               return prev;
            }
            const next = { ...prev };
            delete next[key];
            return next;
         }
         if (prev[key] === message) {
            return prev;
         }
         return { ...prev, [key]: message };
      });
   }

   function handleSubmit() {
      enrollmentMutation.reset();
      const nextApplicantErrors = validateApplicantInfo(applicant);
      const nextGroupErrors =
         enrollmentType === "group" ? validateGroupInfo(groupInfo) : {};

      setApplicantErrors(nextApplicantErrors);
      setGroupErrors(nextGroupErrors);

      if (!selectedCourse) {
         setCurrentStep(1);
         return;
      }

      if (
         Object.keys(nextApplicantErrors).length > 0 ||
         Object.keys(nextGroupErrors).length > 0
      ) {
         setCurrentStep(2);
         return;
      }

      const payload = buildEnrollmentRequest();

      if (!payload) {
         return;
      }

      enrollmentMutation.mutate(payload);
   }
   function handleResetForm() {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);

      setCurrentStep(1);
      setSelectedCourse(null);
      setEnrollmentType("personal");
      setApplicant(initialApplicant);
      setGroupInfo(createInitialGroupInfo());
      setApplicantErrors({});
      setGroupErrors({});
      setAgreedToTerms(false);
      setEnrollmentResult(null);
      enrollmentMutation.reset();
   }

   if (enrollmentResult && selectedCourse) {
      return (
         <CompletionPage
            enrollment={enrollmentResult}
            selectedCourse={selectedCourse}
            enrollmentType={enrollmentType}
            applicant={applicant}
            groupInfo={groupInfo}
            onReset={handleResetForm}
         />
      );
   }

   return (
      <main className="container">
         <h1>수강 신청</h1>

         <div className="step-indicator">
            <span className={currentStep === 1 ? "current" : ""}>
               1. 강의 선택
            </span>
            <span className={currentStep === 2 ? "current" : ""}>
               2. 정보 입력
            </span>
            <span className={currentStep === 3 ? "current" : ""}>
               3. 확인 및 제출
            </span>
         </div>

         {currentStep === 1 && (
            <>
               <CourseStep
                  selectedCourse={selectedCourse}
                  onSelectCourse={setSelectedCourse}
                  enrollmentType={enrollmentType}
                  onChangeEnrollmentType={handleChangeEnrollmentType}
               />

               <div className="actions">
                  <button
                     type="button"
                     className="primary-button"
                     disabled={!selectedCourse}
                     onClick={goToNextFromCourse}
                  >
                     다음 단계
                  </button>
               </div>
            </>
         )}

         {currentStep === 2 && (
            <>
               <ApplicantStep
                  enrollmentType={enrollmentType}
                  applicant={applicant}
                  groupInfo={groupInfo}
                  applicantErrors={applicantErrors}
                  groupErrors={groupErrors}
                  onChangeApplicant={setApplicant}
                  onChangeGroupInfo={setGroupInfo}
                  onClearApplicantError={handleClearApplicantError}
                  onSetApplicantError={handleSetApplicantError}
                  onClearGroupError={handleClearGroupError}
                  onSetGroupError={handleSetGroupError}
               />
               <div className="actions">
                  <button
                     type="button"
                     className="secondary-button"
                     onClick={() => handleEditStep(1)}
                  >
                     이전 단계
                  </button>

                  <button
                     type="button"
                     className="primary-button"
                     onClick={goToNextFromApplicant}
                  >
                     다음 단계
                  </button>
               </div>
            </>
         )}

         {currentStep === 3 && selectedCourse && (
            <ConfirmStep
               selectedCourse={selectedCourse}
               enrollmentType={enrollmentType}
               applicant={applicant}
               groupInfo={groupInfo}
               agreedToTerms={agreedToTerms}
               submitError={enrollmentMutation.error}
               isSubmitting={enrollmentMutation.isPending}
               onChangeAgreedToTerms={setAgreedToTerms}
               onEdit={handleEditStep}
               onSubmit={handleSubmit}
            />
         )}
         <Footer />
      </main>
   );
}
