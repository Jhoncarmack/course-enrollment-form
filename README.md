# Course Enrollment Form

## 프로젝트 개요

온라인 교육 플랫폼의 다단계 수강 신청 폼을 구현하는 프로젝트입니다.

사용자는 강의를 선택하고, 개인 또는 단체 신청 유형에 따라 정보를 입력한 뒤, 최종 확인 화면에서 내용을 검토하고 제출할 수 있습니다.

## 기술 스택

- TypeScript
- Next.js (App Router): Mock API(Route Handler)와 프론트엔드를 하나의 프로젝트에서 관리하기 위해 선택
- React
- TanStack Query
- CSS

## 실행 방법

npm install

npm run dev

브라우저에서 http://localhost:3000 으로 접속합니다.

## 요구사항 해석 및 가정

작성 예정

## 설계 결정과 이유

## 설계 결정과 이유

### Mock API: Next.js Route Handler 사용

별도 서버나 MSW 같은 도구 없이 Next.js 내장 Route Handler로 Mock API를 구성했다.
실행 명령어가 `npm run dev` 하나로 끝나고, 의존성이 추가되지 않는 장점이 있다.
강의 데이터는 코드 내 배열로 직접 정의했고, category 쿼리 파라미터로 필터링한다.

### 타입 우선 설계

과제에서 제공한 API 스키마를 `types/course.ts`에 먼저 정의한 뒤,
Mock API와 화면 컴포넌트가 이 타입을 공유하도록 했다.
서버 응답 모양과 화면 사용 모양이 어긋나는 일을 줄이기 위함이다.

### 상태 관리 전략

- 서버 데이터(강의 목록): TanStack Query로 관리. 로딩/에러/캐싱이 자동 처리되고,
  카테고리별 캐시를 활용해 같은 카테고리 재방문 시 즉시 표시한다.
- 폼 데이터(선택한 강의, 신청 유형): `page.tsx`에서 useState로 관리하고
  자식 컴포넌트에 props로 내려준다(lifting state up).
  단계 간 데이터 공유가 자연스러워진다.
- 화면 내부 UI 상태(카테고리 필터): 해당 컴포넌트 내부 useState. 다른 단계와 무관하므로.

## 미구현 / 제약사항

작성 예정

## AI 활용 범위

작성 예정
