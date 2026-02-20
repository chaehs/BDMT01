# Badminton Racket Review App Blueprint

## 1. Project Overview
본 프로젝트는 배드민턴 동호인들에게 라켓의 상세 스펙과 실사용 후기를 제공하는 플랫폼입니다. 사용자는 라켓의 기술적 정보를 확인하고, 자신의 의견을 태그(#초보자용, #가성비 등)와 평가(좋아요, 보통, 별로에요)로 공유할 수 있습니다. Supabase를 백엔드로 활용하며, 최종적으로는 하이브리드 앱 출시를 목표로 합니다.

## 2. Implemented Features & Design

### 2.1. Core Functionality
- **라켓 목록 표시**: 메인 페이지에서 등록된 라켓들을 2열 그리드 형식으로 나열.
- **라켓 카드 (ID-Card Style)**: 주민등록증 형태의 레이아웃으로 이미지와 스펙 정보를 효과적으로 전달.
- **평가 시스템**: 좋아요, 보통, 별로에요 3단계 버튼 구성.
- **태그 시스템**: 사용자가 라켓의 특징을 한눈에 파악할 수 있는 키워드 태그 노출.

### 2.2. Tech Stack & Design
- **Frontend**: Vue 3 (Composition API, `<script setup>`)
- **Backend**: Supabase (rackets, racket_tags, rackets-tags 테이블 설계)
- **Styling**: Tailwind CSS
- **Layout**: 2열 그리드 시스템, 모바일 최적화를 고려한 반응형 디자인
- **Typography**: Inter (전문적이고 깨끗한 느낌)

## 3. Current Requested Plan & Steps

### Step 1: RacketCard 컴포넌트 고도화 (완료)
- `appInfo.txt`의 요구사항에 맞춰 주민등록증 형태의 레이아웃 구현.
- 좌측: 라켓 이미지 영역 (Gradient 배경 및 그림자 효과).
- 우측: 상세 스펙 리스트 (무게, 밸런스, 탄성, 장력, 그립, 주요 색상).
- 하단: 태그 리스트 및 3단계 평가 버튼 (좋아요, 보통, 별로).

### Step 2: RacketList 레이아웃 및 데이터 최적화 (완료)
- `grid-cols-1 md:grid-cols-2` 설정을 통해 모바일 1열, 태블릿/데스크탑 2열 배치.
- `gap-10 md:gap-16`의 충분한 간격을 주어 가독성 확보.
- 실제 라켓 브랜드(Yonex, Victor)와 스펙을 포함한 Mock 데이터 구성.

### Step 3: Supabase 연동 (예정)
- Supabase 클라이언트 설정 및 실시간 데이터 페칭 준비.

### Step 4: 스타일 미세 조정 및 레이아웃 최적화 (완료)
- `RacketCard`의 태그 영역 및 전체적인 여백 최적화.
- 태그 컨테이너의 `min-h`를 `44px`에서 `32px`로, 하단 여백(`mb-4` → `mb-2`) 및 상단 여백(`pt-4` → `pt-3`) 축소.
- 카드 전체 패딩(`p-5` → `p-4`) 및 메인 콘텐츠 여백(`mb-6` → `mb-4`)을 줄여 더 콤팩트한 디자인 구현.

---
마지막 업데이트: 2024-05-22
