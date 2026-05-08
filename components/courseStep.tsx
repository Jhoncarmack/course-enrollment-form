"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/api";
import type { Course, CourseCategory } from "@/types/course";
import type { EnrollmentType } from "@/types/enrollment";

interface CourseStepProps {
   selectedCourse: Course | null;
   onSelectCourse: (course: Course) => void;
   enrollmentType: EnrollmentType;
   onChangeEnrollmentType: (type: EnrollmentType) => void;
}

const categoryLabels: Record<CourseCategory | "all", string> = {
   all: "전체",
   development: "개발",
   design: "디자인",
   marketing: "마케팅",
   business: "비즈니스",
};

function formatPrice(price: number) {
   return `${price.toLocaleString("ko-KR")}원`;
}

function formatDate(date: string) {
   return new Date(date).toLocaleDateString("ko-KR");
}

export default function CourseStep({
   selectedCourse,
   onSelectCourse,
   enrollmentType,
   onChangeEnrollmentType,
}: CourseStepProps) {
   const [selectedCategory, setSelectedCategory] = useState<
      CourseCategory | "all"
   >("all");

   const { data, isLoading, isError, error } = useQuery({
      queryKey: ["courses", selectedCategory],
      queryFn: () =>
         getCourses(selectedCategory === "all" ? undefined : selectedCategory),
   });

   const courses = data?.courses ?? [];
   const categories = data?.categories ?? [];

   return (
      <section className="step-card">
         <h2>1단계. 강의 선택</h2>
         <p className="description">
            수강할 강의를 선택하고 신청 유형을 골라주세요.
         </p>

         <div className="category-list">
            <button
               type="button"
               className={selectedCategory === "all" ? "active" : ""}
               onClick={() => setSelectedCategory("all")}
            >
               전체
            </button>

            {categories.map((category) => (
               <button
                  type="button"
                  key={category}
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => setSelectedCategory(category)}
               >
                  {categoryLabels[category]}
               </button>
            ))}
         </div>

         {isLoading && <p>강의 목록을 불러오는 중입니다.</p>}

         {isError && (
            <p className="error-message">
               {error instanceof Error
                  ? error.message
                  : "알 수 없는 오류가 발생했습니다."}
            </p>
         )}

         {!isLoading && !isError && courses.length === 0 && (
            <p>표시할 강의가 없습니다.</p>
         )}

         <div className="course-grid">
            {courses.map((course) => {
               const isFull = course.currentEnrollment >= course.maxCapacity;
               const isAlmostFull =
                  !isFull && course.maxCapacity - course.currentEnrollment <= 3;
               const isSelected = selectedCourse?.id === course.id;

               return (
                  <button
                     type="button"
                     key={course.id}
                     className={`course-card ${isSelected ? "selected" : ""}`}
                     onClick={() => {
                        if (!isFull) {
                           onSelectCourse(course);
                        }
                     }}
                     disabled={isFull}
                  >
                     <div className="course-card-header">
                        <strong>{course.title}</strong>
                        {isFull && <span className="badge">마감</span>}
                        {isAlmostFull && (
                           <span className="badge badge-warning">
                              마감 임박
                           </span>
                        )}
                     </div>

                     <p>{course.description}</p>

                     <dl>
                        <div>
                           <dt>가격</dt>
                           <dd>{formatPrice(course.price)}</dd>
                        </div>
                        <div>
                           <dt>일정</dt>
                           <dd>
                              {formatDate(course.startDate)} ~{" "}
                              {formatDate(course.endDate)}
                           </dd>
                        </div>
                        <div>
                           <dt>강사</dt>
                           <dd>{course.instructor}</dd>
                        </div>
                        <div>
                           <dt>정원</dt>
                           <dd>
                              {course.currentEnrollment} / {course.maxCapacity}
                           </dd>
                        </div>
                     </dl>
                  </button>
               );
            })}
         </div>

         {selectedCourse && (
            <div className="selected-course">
               <h3>선택한 강의</h3>
               <p>
                  <strong>{selectedCourse.title}</strong>
               </p>
               <p>가격: {formatPrice(selectedCourse.price)}</p>
               <p>
                  일정: {formatDate(selectedCourse.startDate)} ~{" "}
                  {formatDate(selectedCourse.endDate)}
               </p>
            </div>
         )}

         <div className="application-type">
            <h3>신청 유형</h3>

            <label>
               <input
                  type="radio"
                  name="enrollmentType"
                  value="personal"
                  checked={enrollmentType === "personal"}
                  onChange={() => onChangeEnrollmentType("personal")}
               />
               개인 신청
            </label>

            <label>
               <input
                  type="radio"
                  name="enrollmentType"
                  value="group"
                  checked={enrollmentType === "group"}
                  onChange={() => onChangeEnrollmentType("group")}
               />
               단체 신청
            </label>
         </div>
      </section>
   );
}
