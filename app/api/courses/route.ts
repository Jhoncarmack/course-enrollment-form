// app/api/courses/route.ts

import { NextRequest, NextResponse } from "next/server";
import type { Course, CourseCategory } from "@/types/course.ts";

const categories: CourseCategory[] = [
   "development",
   "design",
   "marketing",
   "business",
];

const courses: Course[] = [
   {
      id: "course-1",
      title: "프론트엔드 입문",
      description: "HTML, CSS, JavaScript 기초부터 React 입문까지 학습합니다.",
      category: "development",
      price: 120000,
      maxCapacity: 30,
      currentEnrollment: 12,
      startDate: "2026-06-01T09:00:00.000Z",
      endDate: "2026-06-30T09:00:00.000Z",
      instructor: "김개발",
   },
   {
      id: "course-2",
      title: "TypeScript 기초",
      description: "TypeScript의 기본 타입과 실전 사용법을 학습합니다.",
      category: "development",
      price: 150000,
      maxCapacity: 25,
      currentEnrollment: 25,
      startDate: "2026-07-01T09:00:00.000Z",
      endDate: "2026-07-31T09:00:00.000Z",
      instructor: "이타입",
   },
   {
      id: "course-3",
      title: "UX/UI 디자인 입문",
      description: "사용자 경험을 고려한 화면 설계 기초를 학습합니다.",
      category: "design",
      price: 100000,
      maxCapacity: 20,
      currentEnrollment: 8,
      startDate: "2026-06-10T09:00:00.000Z",
      endDate: "2026-07-10T09:00:00.000Z",
      instructor: "박디자인",
   },
   {
      id: "course-4",
      title: "디지털 마케팅 전략",
      description: "온라인 교육 서비스에 필요한 마케팅 전략을 학습합니다.",
      category: "marketing",
      price: 90000,
      maxCapacity: 40,
      currentEnrollment: 31,
      startDate: "2026-06-15T09:00:00.000Z",
      endDate: "2026-07-15T09:00:00.000Z",
      instructor: "최마케팅",
   },
   {
      id: "course-5",
      title: "비즈니스 커뮤니케이션",
      description: "실무에서 필요한 커뮤니케이션 방법을 학습합니다.",
      category: "business",
      price: 80000,
      maxCapacity: 35,
      currentEnrollment: 10,
      startDate: "2026-08-01T09:00:00.000Z",
      endDate: "2026-08-31T09:00:00.000Z",
      instructor: "정비즈",
   },
];

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const category = searchParams.get("category");

   const filteredCourses =
      category && categories.includes(category as CourseCategory)
         ? courses.filter((course) => course.category === category)
         : courses;

   return NextResponse.json({
      courses: filteredCourses,
      categories,
   });
}
