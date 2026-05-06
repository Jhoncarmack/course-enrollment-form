"use client";

import type { ApplicantInfo } from "@/types/enrollment";
import type { ApplicantErrors } from "@/lib/validations";

interface ApplicantStepProps {
   applicant: ApplicantInfo;
   errors: ApplicantErrors;
   onChangeApplicant: (applicant: ApplicantInfo) => void;
}

export default function ApplicantStep({
   applicant,
   errors,
   onChangeApplicant,
}: ApplicantStepProps) {
   function handleChange(field: keyof ApplicantInfo, value: string) {
      onChangeApplicant({
         ...applicant,
         [field]: value,
      });
   }

   return (
      <section className="step-card">
         <h2>2단계. 수강생 정보 입력</h2>
         <p className="description">
            수강 신청에 필요한 기본 정보를 입력해 주세요.
         </p>

         <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
               id="name"
               type="text"
               value={applicant.name}
               onChange={(event) => handleChange("name", event.target.value)}
               placeholder="이름을 입력해 주세요"
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
         </div>

         <div className="form-group">
            <label htmlFor="email">이메일 *</label>
            <input
               id="email"
               type="email"
               value={applicant.email}
               onChange={(event) => handleChange("email", event.target.value)}
               placeholder="example@email.com"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
         </div>

         <div className="form-group">
            <label htmlFor="phone">전화번호 *</label>
            <input
               id="phone"
               type="tel"
               value={applicant.phone}
               onChange={(event) => handleChange("phone", event.target.value)}
               placeholder="010-1234-5678"
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
         </div>

         <div className="form-group">
            <label htmlFor="motivation">수강 동기</label>
            <textarea
               id="motivation"
               value={applicant.motivation}
               onChange={(event) =>
                  handleChange("motivation", event.target.value)
               }
               placeholder="수강 동기를 입력해 주세요"
               rows={5}
               maxLength={300}
            />
            <div className="textarea-footer">
               <span>{applicant.motivation.length} / 300</span>
            </div>
            {errors.motivation && (
               <p className="field-error">{errors.motivation}</p>
            )}
         </div>
      </section>
   );
}
