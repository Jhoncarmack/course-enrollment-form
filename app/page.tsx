"use client";

import { useState } from "react";
import CourseStep from "@/components/courseStep";
import ApplicantStep from "@/components/ApplicantStep";
import { validateApplicantInfo, validateGroupInfo } from "@/lib/validations";
import type { Course } from "@/types/course";
import type {
   ApplicantInfo,
   EnrollmentType,
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

         {currentStep === 3 && (
            <section className="step-card">
               <h2>3단계. 확인 및 제출</h2>
               <p className="description">
                  확인 및 제출 화면은 다음 단계에서 구현합니다.
               </p>

               <div className="selected-course">
                  <h3>입력 확인</h3>
                  <p>선택한 강의: {selectedCourse?.title}</p>
                  <p>
                     신청 유형:{" "}
                     {enrollmentType === "personal" ? "개인 신청" : "단체 신청"}
                  </p>
                  <p>이름: {applicant.name}</p>
                  <p>이메일: {applicant.email}</p>
                  <p>전화번호: {applicant.phone}</p>
                  {applicant.motivation && (
                     <p>수강 동기: {applicant.motivation}</p>
                  )}

                  {enrollmentType === "group" && (
                     <>
                        <h4>단체 정보</h4>
                        <p>단체명: {groupInfo.organizationName}</p>
                        <p>신청 인원수: {groupInfo.headCount}명</p>
                        <p>담당자 연락처: {groupInfo.contactPerson}</p>

                        <ul>
                           {groupInfo.participants.map((participant, index) => (
                              <li key={index}>
                                 {participant.name} / {participant.email}
                              </li>
                           ))}
                        </ul>
                     </>
                  )}
               </div>

               <div className="actions">
                  <button
                     type="button"
                     className="secondary-button"
                     onClick={() => setCurrentStep(2)}
                  >
                     이전 단계
                  </button>
               </div>
            </section>
         )}
      </main>
   );
}
