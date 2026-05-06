"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import CourseStep from "@/components/CourseStep";
import ApplicantStep from "@/components/ApplicantStep";
import ConfirmStep from "@/components/ConfirmStep";
import CompletionPage from "@/components/CompletionPage";
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

type Step = 1 | 2 | 3;

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

   const enrollmentMutation = useMutation<
      EnrollmentResponse,
      ErrorResponse,
      EnrollmentRequest
   >({
      mutationFn: submitEnrollment,
      onSuccess: (data) => {
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

   function handleSubmit() {
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

   if (enrollmentResult && selectedCourse) {
      return (
         <CompletionPage
            enrollment={enrollmentResult}
            selectedCourse={selectedCourse}
            enrollmentType={enrollmentType}
            applicant={applicant}
            groupInfo={groupInfo}
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
               />

               <div className="actions">
                  <button
                     type="button"
                     className="secondary-button"
                     onClick={() => setCurrentStep(1)}
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
               onEdit={setCurrentStep}
               onSubmit={handleSubmit}
            />
         )}
      </main>
   );
}
