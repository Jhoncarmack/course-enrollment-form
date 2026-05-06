"use client";

import type { Course } from "@/types/course";
import type {
   ApplicantInfo,
   EnrollmentType,
   ErrorResponse,
   GroupInfo,
} from "@/types/enrollment";

interface ConfirmStepProps {
   selectedCourse: Course;
   enrollmentType: EnrollmentType;
   applicant: ApplicantInfo;
   groupInfo: GroupInfo;
   agreedToTerms: boolean;
   submitError: ErrorResponse | null;
   isSubmitting: boolean;
   onChangeAgreedToTerms: (checked: boolean) => void;
   onEdit: (step: 1 | 2) => void;
   onSubmit: () => void;
}

function formatPrice(price: number) {
   return `${price.toLocaleString("ko-KR")}원`;
}

function formatDate(date: string) {
   return new Date(date).toLocaleDateString("ko-KR");
}

function getErrorMessage(error: ErrorResponse | null) {
   if (!error) {
      return "";
   }

   switch (error.code) {
      case "COURSE_FULL":
         return "선택한 강의의 정원이 초과되었습니다. 다른 강의를 선택해 주세요.";
      case "DUPLICATE_ENROLLMENT":
         return "이미 신청된 강의입니다. 입력 정보를 확인해 주세요.";
      case "INVALID_INPUT":
         return error.message || "입력값을 다시 확인해 주세요.";
      default:
         return "제출 중 오류가 발생했습니다. 다시 시도해 주세요.";
   }
}

export default function ConfirmStep({
   selectedCourse,
   enrollmentType,
   applicant,
   groupInfo,
   agreedToTerms,
   submitError,
   isSubmitting,
   onChangeAgreedToTerms,
   onEdit,
   onSubmit,
}: ConfirmStepProps) {
   return (
      <section className="step-card">
         <h2>3단계. 확인 및 제출</h2>
         <p className="description">
            입력한 내용을 확인한 뒤 수강 신청을 제출해 주세요.
         </p>

         <div className="summary-section">
            <div className="summary-header">
               <h3>강의 정보</h3>
               <button type="button" onClick={() => onEdit(1)}>
                  수정
               </button>
            </div>

            <p>강의명: {selectedCourse.title}</p>
            <p>가격: {formatPrice(selectedCourse.price)}</p>
            <p>
               일정: {formatDate(selectedCourse.startDate)} ~{" "}
               {formatDate(selectedCourse.endDate)}
            </p>
            <p>강사: {selectedCourse.instructor}</p>
         </div>

         <div className="summary-section">
            <div className="summary-header">
               <h3>신청자 정보</h3>
               <button type="button" onClick={() => onEdit(2)}>
                  수정
               </button>
            </div>

            <p>
               신청 유형:{" "}
               {enrollmentType === "personal" ? "개인 신청" : "단체 신청"}
            </p>
            <p>
               {enrollmentType === "group" ? "대표자 이름" : "이름"}:{" "}
               {applicant.name}
            </p>
            <p>
               {enrollmentType === "group" ? "대표자 이메일" : "이메일"}:{" "}
               {applicant.email}
            </p>
            <p>
               {enrollmentType === "group" ? "대표자 전화번호" : "전화번호"}:{" "}
               {applicant.phone}
            </p>
            {applicant.motivation && <p>수강 동기: {applicant.motivation}</p>}
         </div>

         {enrollmentType === "group" && (
            <div className="summary-section">
               <div className="summary-header">
                  <h3>단체 신청 정보</h3>
                  <button type="button" onClick={() => onEdit(2)}>
                     수정
                  </button>
               </div>

               <p>단체명: {groupInfo.organizationName}</p>
               <p>신청 인원수: {groupInfo.headCount}명</p>
               <p>담당자 연락처: {groupInfo.contactPerson}</p>

               <h4>참가자 명단</h4>
               <ul>
                  {groupInfo.participants.map((participant, index) => (
                     <li key={index}>
                        참가자 {index + 1}: {participant.name} /{" "}
                        {participant.email}
                     </li>
                  ))}
               </ul>
            </div>
         )}

         <div className="terms-box">
            <label>
               <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) =>
                     onChangeAgreedToTerms(event.target.checked)
                  }
               />
               이용약관에 동의합니다.
            </label>
         </div>

         {submitError && (
            <div className="submit-error">
               <strong>제출 실패</strong>
               <p>{getErrorMessage(submitError)}</p>
               <p>
                  입력한 데이터는 유지됩니다. 내용을 확인한 뒤 다시 시도해
                  주세요.
               </p>
            </div>
         )}

         <div className="actions">
            <button
               type="button"
               className="secondary-button"
               onClick={() => onEdit(2)}
            >
               이전 단계
            </button>

            <button
               type="button"
               className="primary-button"
               disabled={!agreedToTerms || isSubmitting}
               onClick={onSubmit}
            >
               {isSubmitting ? "제출 중..." : "제출"}
            </button>
         </div>
      </section>
   );
}
