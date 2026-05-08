import { NextRequest, NextResponse } from "next/server";
import type {
   EnrollmentRequest,
   EnrollmentResponse,
   ErrorResponse,
} from "@/types/enrollment";

function createErrorResponse(
   status: number,
   error: ErrorResponse,
): NextResponse<ErrorResponse> {
   return NextResponse.json(error, { status });
}

export async function POST(request: NextRequest) {
   const body = (await request.json()) as EnrollmentRequest;

   if (!body.courseId) {
      return createErrorResponse(400, {
         code: "INVALID_INPUT",
         message: "강의 정보가 누락되었습니다.",
         details: {
            courseId: "강의를 선택해 주세요.",
         },
      });
   }

   if (!body.agreedToTerms) {
      return createErrorResponse(400, {
         code: "INVALID_INPUT",
         message: "이용약관에 동의해 주세요.",
         details: {
            agreedToTerms: "이용약관 동의가 필요합니다.",
         },
      });
   }

   if (
      !body.applicant?.name ||
      !body.applicant?.email ||
      !body.applicant?.phone
   ) {
      return createErrorResponse(400, {
         code: "INVALID_INPUT",
         message: "신청자 필수 정보가 누락되었습니다.",
      });
   }

   // 시뮬레이션용: course-3 선택 시 COURSE_FULL 에러 반환 (README 참고)
   if (body.courseId === "course-3") {
      return createErrorResponse(409, {
         code: "COURSE_FULL",
         message: "선택한 강의의 정원이 초과되었습니다.",
      });
   }

   if (body.applicant.email.toLowerCase() === "duplicate@example.com") {
      return createErrorResponse(409, {
         code: "DUPLICATE_ENROLLMENT",
         message: "이미 신청된 강의입니다.",
      });
   }

   if (body.type === "group") {
      if (
         !body.group.organizationName ||
         !body.group.contactPerson ||
         body.group.participants.length !== body.group.headCount
      ) {
         return createErrorResponse(400, {
            code: "INVALID_INPUT",
            message: "단체 신청 정보가 올바르지 않습니다.",
         });
      }
   }

   const response: EnrollmentResponse = {
      enrollmentId: `ENR-${Date.now()}`,
      status: "confirmed",
      enrolledAt: new Date().toISOString(),
   };

   return NextResponse.json(response, { status: 201 });
}
