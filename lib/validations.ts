import type { ApplicantInfo } from "@/types/enrollment";

export type ApplicantErrors = Partial<Record<keyof ApplicantInfo, string>>;

export function validateApplicantInfo(
   applicant: ApplicantInfo,
): ApplicantErrors {
   const errors: ApplicantErrors = {};

   const name = applicant.name.trim();
   const email = applicant.email.trim();
   const phone = applicant.phone.trim();
   const motivation = applicant.motivation.trim();

   if (!name) {
      errors.name = "이름을 입력해 주세요.";
   } else if (name.length < 2 || name.length > 20) {
      errors.name = "이름은 2자 이상 20자 이하로 입력해 주세요.";
   }

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (!email) {
      errors.email = "이메일을 입력해 주세요.";
   } else if (!emailRegex.test(email)) {
      errors.email = "올바른 이메일 형식으로 입력해 주세요.";
   }

   const koreanPhoneRegex =
      /^(01[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/;

   if (!phone) {
      errors.phone = "전화번호를 입력해 주세요.";
   } else if (!koreanPhoneRegex.test(phone)) {
      errors.phone = "올바른 한국 전화번호 형식으로 입력해 주세요.";
   }

   if (motivation.length > 300) {
      errors.motivation = "수강 동기는 최대 300자까지 입력할 수 있습니다.";
   }

   return errors;
}
