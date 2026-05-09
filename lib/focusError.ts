import type { ApplicantErrors, GroupErrors } from "./validations";

// 신청자 필드 검증 순서 (위에서 아래)
const APPLICANT_FIELD_ORDER: (keyof ApplicantErrors)[] = [
   "name",
   "email",
   "phone",
   "motivation",
];

// 에러 키 → DOM id 매핑
function applicantFieldToId(field: keyof ApplicantErrors): string {
   return field; // name, email, phone, motivation
}

function groupFieldToId(field: string): string | null {
   if (field === "organizationName") return "organizationName";
   if (field === "headCount") return "headCount";
   if (field === "contactPerson") return "contactPerson";

   // 참가자 필드: "participants.0.name" → "participant-0-name"
   const match = field.match(/^participants\.(\d+)\.(name|email)$/);
   if (match) {
      return `participant-${match[1]}-${match[2]}`;
   }

   return null;
}

/**
 * 신청자/단체 에러를 보고 가장 위(첫 번째) 에러 필드의 DOM id를 반환
 * 화면 순서: 신청자 → 단체명 → 인원수 → 참가자 → 담당자
 */
export function findFirstErrorFieldId(
   applicantErrors: ApplicantErrors,
   groupErrors: GroupErrors,
   isGroup: boolean,
): string | null {
   // 신청자 필드 우선
   for (const field of APPLICANT_FIELD_ORDER) {
      if (applicantErrors[field]) {
         return applicantFieldToId(field);
      }
   }

   if (!isGroup) {
      return null;
   }

   // 단체명 → 인원수
   if (groupErrors.organizationName) return "organizationName";
   if (groupErrors.headCount) return "headCount";

   // 참가자 N명 (인덱스 순서대로 0, 1, 2...)
   const participantKeys = Object.keys(groupErrors)
      .filter((k) => k.startsWith("participants."))
      .sort((a, b) => {
         const aIdx = Number(a.split(".")[1]);
         const bIdx = Number(b.split(".")[1]);
         if (aIdx !== bIdx) return aIdx - bIdx;
         // 같은 참가자면 name 먼저
         return a.endsWith(".name") ? -1 : 1;
      });

   if (participantKeys.length > 0) {
      return groupFieldToId(participantKeys[0]);
   }

   // 마지막으로 담당자 연락처
   if (groupErrors.contactPerson) return "contactPerson";

   return null;
}

/**
 * 주어진 ID의 input 요소로 포커스 + 화면 스크롤
 */
export function focusFieldById(id: string): void {
   const element = document.getElementById(id);
   if (!element) return;

   element.focus();
   element.scrollIntoView({ behavior: "smooth", block: "center" });
}
