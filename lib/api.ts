import type { CourseCategory, CourseListResponse } from "@/types/course";

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
