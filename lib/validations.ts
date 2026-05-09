import type { ApplicantInfo, GroupInfo } from "@/types/enrollment";

export type ApplicantErrors = Partial<Record<keyof ApplicantInfo, string>>;
export type GroupErrors = Record<string, string>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const koreanPhoneRegex =
   /^(01[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/;

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

   if (!email) {
      errors.email = "이메일을 입력해 주세요.";
   } else if (!emailRegex.test(email)) {
      errors.email = "올바른 이메일 형식으로 입력해 주세요.";
   }

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

export function validateGroupInfo(group: GroupInfo): GroupErrors {
   const errors: GroupErrors = {};

   if (!group.organizationName.trim()) {
      errors.organizationName = "단체명을 입력해 주세요.";
   }

   if (!Number.isInteger(group.headCount)) {
      errors.headCount = "신청 인원수를 입력해 주세요.";
   } else if (group.headCount < 2 || group.headCount > 10) {
      errors.headCount = "신청 인원수는 2명 이상 10명 이하로 입력해 주세요.";
   }

   if (!group.contactPerson.trim()) {
      errors.contactPerson = "담당자 연락처를 입력해 주세요.";
   } else if (!koreanPhoneRegex.test(group.contactPerson.trim())) {
      errors.contactPerson = "올바른 한국 전화번호 형식으로 입력해 주세요.";
   }

   const participants = group.participants.slice(0, group.headCount);
   const emailMap = new Map<string, number>();

   participants.forEach((participant, index) => {
      const name = participant.name.trim();
      const email = participant.email.trim().toLowerCase();

      if (!name) {
         errors[`participants.${index}.name`] = "참가자 이름을 입력해 주세요.";
      }

      if (!email) {
         errors[`participants.${index}.email`] =
            "참가자 이메일을 입력해 주세요.";
      } else if (!emailRegex.test(email)) {
         errors[`participants.${index}.email`] =
            "올바른 이메일 형식으로 입력해 주세요.";
      } else if (emailMap.has(email)) {
         errors[`participants.${index}.email`] =
            "참가자 이메일은 중복될 수 없습니다.";

         const duplicatedIndex = emailMap.get(email);

         if (duplicatedIndex !== undefined) {
            errors[`participants.${duplicatedIndex}.email`] =
               "참가자 이메일은 중복될 수 없습니다.";
         }
      } else {
         emailMap.set(email, index);
      }
   });

   return errors;
}
// 단일 신청자 필드 검증 (blur 시 사용)
export function validateApplicantField(
   field: keyof ApplicantInfo,
   value: string,
): string | undefined {
   const trimmed = value.trim();

   switch (field) {
      case "name":
         if (!trimmed) {
            return "이름을 입력해 주세요.";
         }
         if (trimmed.length < 2 || trimmed.length > 20) {
            return "이름은 2자 이상 20자 이하로 입력해 주세요.";
         }
         return undefined;

      case "email":
         if (!trimmed) {
            return "이메일을 입력해 주세요.";
         }
         if (!emailRegex.test(trimmed)) {
            return "올바른 이메일 형식으로 입력해 주세요.";
         }
         return undefined;

      case "phone":
         if (!trimmed) {
            return "전화번호를 입력해 주세요.";
         }
         if (!koreanPhoneRegex.test(trimmed)) {
            return "올바른 한국 전화번호 형식으로 입력해 주세요.";
         }
         return undefined;

      case "motivation":
         if (trimmed.length > 300) {
            return "수강 동기는 최대 300자까지 입력할 수 있습니다.";
         }
         return undefined;

      default:
         return undefined;
   }
}

// 단일 단체 필드 검증 (blur 시 사용)
export function validateGroupField(
   field: "organizationName" | "contactPerson",
   value: string,
): string | undefined {
   const trimmed = value.trim();

   switch (field) {
      case "organizationName":
         if (!trimmed) {
            return "단체명을 입력해 주세요.";
         }
         return undefined;

      case "contactPerson":
         if (!trimmed) {
            return "담당자 연락처를 입력해 주세요.";
         }
         if (!koreanPhoneRegex.test(trimmed)) {
            return "올바른 한국 전화번호 형식으로 입력해 주세요.";
         }
         return undefined;

      default:
         return undefined;
   }
}

// 단일 참가자 필드 검증 (blur 시 사용)
export function validateParticipantField(
   field: "name" | "email",
   value: string,
): string | undefined {
   const trimmed = value.trim();

   switch (field) {
      case "name":
         if (!trimmed) {
            return "참가자 이름을 입력해 주세요.";
         }
         return undefined;

      case "email":
         if (!trimmed) {
            return "참가자 이메일을 입력해 주세요.";
         }
         if (!emailRegex.test(trimmed)) {
            return "올바른 이메일 형식으로 입력해 주세요.";
         }
         return undefined;

      default:
         return undefined;
   }
}
