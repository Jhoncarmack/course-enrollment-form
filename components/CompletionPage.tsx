"use client";

import type { Course } from "@/types/course";
import type {
   ApplicantInfo,
   EnrollmentResponse,
   EnrollmentType,
   GroupInfo,
} from "@/types/enrollment";

interface CompletionPageProps {
   enrollment: EnrollmentResponse;
   selectedCourse: Course;
   enrollmentType: EnrollmentType;
   applicant: ApplicantInfo;
   groupInfo: GroupInfo;
}

function formatDateTime(date: string) {
   return new Date(date).toLocaleString("ko-KR");
}

export default function CompletionPage({
   enrollment,
   selectedCourse,
   enrollmentType,
   applicant,
   groupInfo,
}: CompletionPageProps) {
   return (
      <main className="container">
         <section className="step-card">
            <h1>수강 신청이 완료되었습니다.</h1>

            <div className="completion-box">
               <p>신청 번호: {enrollment.enrollmentId}</p>
               <p>
                  신청 상태:{" "}
                  {enrollment.status === "confirmed" ? "확정" : "대기"}
               </p>
               <p>신청 일시: {formatDateTime(enrollment.enrolledAt)}</p>
            </div>

            <div className="summary-section">
               <h2>신청 요약</h2>
               <p>강의명: {selectedCourse.title}</p>
               <p>
                  신청 유형:{" "}
                  {enrollmentType === "personal" ? "개인 신청" : "단체 신청"}
               </p>
               <p>신청자: {applicant.name}</p>
               <p>이메일: {applicant.email}</p>
               <p>전화번호: {applicant.phone}</p>

               {enrollmentType === "group" && (
                  <>
                     <p>단체명: {groupInfo.organizationName}</p>
                     <p>신청 인원수: {groupInfo.headCount}명</p>
                  </>
               )}
            </div>
         </section>
      </main>
   );
}
