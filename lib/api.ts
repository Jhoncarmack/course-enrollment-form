import type { CourseCategory, CourseListResponse } from "@/types/course";
import type {
   EnrollmentRequest,
   EnrollmentResponse,
   ErrorResponse,
} from "@/types/enrollment";

export async function getCourses(
   category?: CourseCategory,
): Promise<CourseListResponse> {
   const queryString = category ? `?category=${category}` : "";
   const response = await fetch(`/api/courses${queryString}`);

   if (!response.ok) {
      throw new Error("강의 목록을 불러오지 못했습니다.");
   }

   return response.json();
}

export async function submitEnrollment(
   payload: EnrollmentRequest,
): Promise<EnrollmentResponse> {
   const response = await fetch("/api/enrollments", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
   });

   if (!response.ok) {
      const error = (await response.json()) as ErrorResponse;
      throw error;
   }

   return response.json();
}
