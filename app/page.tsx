"use client";

import { useState } from "react";
import CourseStep from "@/components/courseStep";
import type { Course } from "@/types/course";
import type { EnrollmentType } from "@/types/enrollment";

export default function Home() {
   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
   const [enrollmentType, setEnrollmentType] =
      useState<EnrollmentType>("personal");

   const canGoNext = selectedCourse !== null && enrollmentType !== null;

   return (
      <main className="container">
         <h1>수강 신청</h1>

         <div className="step-indicator">
            <span className="current">1. 강의 선택</span>
            <span>2. 정보 입력</span>
            <span>3. 확인 및 제출</span>
         </div>

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
               disabled={!canGoNext}
            >
               다음 단계
            </button>
         </div>
      </main>
   );
}
