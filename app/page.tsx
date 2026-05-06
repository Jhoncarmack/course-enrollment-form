"use client";

import { useState } from "react";
import CourseStep from "@/components/courseStep";
import ApplicantStep from "@/components/ApplicantStep";
import { validateApplicantInfo } from "@/lib/validations";
import type { Course } from "@/types/course";
import type { ApplicantInfo, EnrollmentType } from "@/types/enrollment";
import type { ApplicantErrors } from "@/lib/validations";

type Step = 1 | 2 | 3;

const initialApplicant: ApplicantInfo = {
   name: "",
   email: "",
   phone: "",
   motivation: "",
};

export default function Home() {
   const [currentStep, setCurrentStep] = useState<Step>(1);
   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
   const [enrollmentType, setEnrollmentType] =
      useState<EnrollmentType>("personal");
   const [applicant, setApplicant] = useState<ApplicantInfo>(initialApplicant);
   const [applicantErrors, setApplicantErrors] = useState<ApplicantErrors>({});

   function goToNextFromCourse() {
      if (!selectedCourse) {
         return;
      }

      setCurrentStep(2);
   }

   function goToNextFromApplicant() {
      const errors = validateApplicantInfo(applicant);
      setApplicantErrors(errors);

      if (Object.keys(errors).length > 0) {
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
                  onChangeEnrollmentType={setEnrollmentType}
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
                  applicant={applicant}
                  errors={applicantErrors}
                  onChangeApplicant={setApplicant}
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
