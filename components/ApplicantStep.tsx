"use client";

import type {
   ApplicantInfo,
   EnrollmentType,
   GroupInfo,
   Participant,
} from "@/types/enrollment";
import type { ApplicantErrors, GroupErrors } from "@/lib/validations";

interface ApplicantStepProps {
   enrollmentType: EnrollmentType;
   applicant: ApplicantInfo;
   groupInfo: GroupInfo;
   applicantErrors: ApplicantErrors;
   groupErrors: GroupErrors;
   onChangeApplicant: (applicant: ApplicantInfo) => void;
   onChangeGroupInfo: (groupInfo: GroupInfo) => void;
}

export default function ApplicantStep({
   enrollmentType,
   applicant,
   groupInfo,
   applicantErrors,
   groupErrors,
   onChangeApplicant,
   onChangeGroupInfo,
}: ApplicantStepProps) {
   function handleApplicantChange(field: keyof ApplicantInfo, value: string) {
      onChangeApplicant({
         ...applicant,
         [field]: value,
      });
   }

   function handleGroupChange(field: keyof GroupInfo, value: string | number) {
      onChangeGroupInfo({
         ...groupInfo,
         [field]: value,
      });
   }

   function handleHeadCountChange(value: number) {
      const safeHeadCount = Math.min(Math.max(value, 2), 10);
      const nextParticipants = [...groupInfo.participants];

      while (nextParticipants.length < safeHeadCount) {
         nextParticipants.push({ name: "", email: "" });
      }

      onChangeGroupInfo({
         ...groupInfo,
         headCount: safeHeadCount,
         participants: nextParticipants.slice(0, safeHeadCount),
      });
   }

   function handleParticipantChange(
      index: number,
      field: keyof Participant,
      value: string,
   ) {
      const nextParticipants = groupInfo.participants.map((participant, i) =>
         i === index
            ? {
                 ...participant,
                 [field]: value,
              }
            : participant,
      );

      onChangeGroupInfo({
         ...groupInfo,
         participants: nextParticipants,
      });
   }

   return (
      <section className="step-card">
         <h2>
            {enrollmentType === "group"
               ? "2단계. 대표 신청자 정보 입력"
               : "2단계. 수강생 정보 입력"}
         </h2>

         <p className="description">
            {enrollmentType === "group"
               ? "단체 신청을 관리할 대표 신청자 정보를 입력해 주세요."
               : "수강 신청에 필요한 기본 정보를 입력해 주세요."}
         </p>

         <div className="form-group">
            <label htmlFor="name">
               {enrollmentType === "group" ? "대표자 이름 *" : "이름 *"}
            </label>
            <input
               id="name"
               type="text"
               value={applicant.name}
               onChange={(event) =>
                  handleApplicantChange("name", event.target.value)
               }
               placeholder="이름을 입력해 주세요"
            />
            {applicantErrors.name && (
               <p className="field-error">{applicantErrors.name}</p>
            )}
         </div>

         <div className="form-group">
            <label htmlFor="email">
               {enrollmentType === "group" ? "대표자 이메일 *" : "이메일 *"}
            </label>
            <input
               id="email"
               type="email"
               value={applicant.email}
               onChange={(event) =>
                  handleApplicantChange("email", event.target.value)
               }
               placeholder="example@email.com"
            />
            {applicantErrors.email && (
               <p className="field-error">{applicantErrors.email}</p>
            )}
         </div>

         <div className="form-group">
            <label htmlFor="phone">
               {enrollmentType === "group" ? "대표자 전화번호 *" : "전화번호 *"}
            </label>
            <input
               id="phone"
               type="tel"
               value={applicant.phone}
               onChange={(event) =>
                  handleApplicantChange("phone", event.target.value)
               }
               placeholder="010-1234-5678"
            />
            {applicantErrors.phone && (
               <p className="field-error">{applicantErrors.phone}</p>
            )}
         </div>

         <div className="form-group">
            <label htmlFor="motivation">수강 동기</label>
            <textarea
               id="motivation"
               value={applicant.motivation}
               onChange={(event) =>
                  handleApplicantChange("motivation", event.target.value)
               }
               placeholder="수강 동기를 입력해 주세요"
               rows={5}
               maxLength={300}
            />
            <div className="textarea-footer">
               <span>{applicant.motivation.length} / 300</span>
            </div>
            {applicantErrors.motivation && (
               <p className="field-error">{applicantErrors.motivation}</p>
            )}
         </div>

         {enrollmentType === "group" && (
            <div className="group-section">
               <h3>단체 신청 정보</h3>

               <div className="form-group">
                  <label htmlFor="organizationName">단체명 *</label>
                  <input
                     id="organizationName"
                     type="text"
                     value={groupInfo.organizationName}
                     onChange={(event) =>
                        handleGroupChange(
                           "organizationName",
                           event.target.value,
                        )
                     }
                     placeholder="단체명을 입력해 주세요"
                  />
                  {groupErrors.organizationName && (
                     <p className="field-error">
                        {groupErrors.organizationName}
                     </p>
                  )}
               </div>

               <div className="form-group">
                  <label htmlFor="headCount">신청 인원수 *</label>
                  <input
                     id="headCount"
                     type="number"
                     min={2}
                     max={10}
                     value={groupInfo.headCount}
                     onChange={(event) =>
                        handleHeadCountChange(Number(event.target.value))
                     }
                  />
                  {groupErrors.headCount && (
                     <p className="field-error">{groupErrors.headCount}</p>
                  )}
               </div>

               <div className="participants-list">
                  <h4>참가자 명단</h4>

                  {groupInfo.participants.map((participant, index) => (
                     <div className="participant-card" key={index}>
                        <strong>참가자 {index + 1}</strong>

                        <div className="form-group">
                           <label htmlFor={`participant-${index}-name`}>
                              이름 *
                           </label>
                           <input
                              id={`participant-${index}-name`}
                              type="text"
                              value={participant.name}
                              onChange={(event) =>
                                 handleParticipantChange(
                                    index,
                                    "name",
                                    event.target.value,
                                 )
                              }
                              placeholder="참가자 이름"
                           />
                           {groupErrors[`participants.${index}.name`] && (
                              <p className="field-error">
                                 {groupErrors[`participants.${index}.name`]}
                              </p>
                           )}
                        </div>

                        <div className="form-group">
                           <label htmlFor={`participant-${index}-email`}>
                              이메일 *
                           </label>
                           <input
                              id={`participant-${index}-email`}
                              type="email"
                              value={participant.email}
                              onChange={(event) =>
                                 handleParticipantChange(
                                    index,
                                    "email",
                                    event.target.value,
                                 )
                              }
                              placeholder="participant@email.com"
                           />
                           {groupErrors[`participants.${index}.email`] && (
                              <p className="field-error">
                                 {groupErrors[`participants.${index}.email`]}
                              </p>
                           )}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="form-group">
                  <label htmlFor="contactPerson">담당자 연락처 *</label>
                  <input
                     id="contactPerson"
                     type="tel"
                     value={groupInfo.contactPerson}
                     onChange={(event) =>
                        handleGroupChange("contactPerson", event.target.value)
                     }
                     placeholder="010-1234-5678"
                  />
                  {groupErrors.contactPerson && (
                     <p className="field-error">{groupErrors.contactPerson}</p>
                  )}
               </div>
            </div>
         )}
      </section>
   );
}
