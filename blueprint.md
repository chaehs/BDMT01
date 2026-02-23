# Badminton Racket Review App Blueprint (BDMT01)

## 1. Project Overview
본 프로젝트는 배드민턴 동호인들에게 라켓의 상세 스펙과 실시간 사용자 태그 및 평점을 제공하는 플랫폼입니다. 확장성과 범용성을 고려하여 설계하며, 최종적으로 하이브리드 앱 출시를 목표로 합니다.

## 2. Implemented Features & Design

### 2.1. Core Functionality (Refined)
- **라켓 목록 및 필터링**:
    - 초기 화면은 데이터 최적화를 위해 빈 화면으로 유지 (검색 유도 UI).
    - 브랜드(Yonex, Victor 등), 무게(3U, 4U 등), 태그 필터링 시스템 구현.
- **라켓 카드 (ID-Card Style)**:
    - 2열 정렬 레이아웃 적용.
    - 스펙 항목: 브랜드, 이름, 무게, 밸런스, 탄성, 최대장력, 그립두께, 프레임형태, 대표색상(도트 표시).
- **평점 시스템**:
    - 목록: ★ 4.7 (26) 형식으로 노출.
    - **상세 보기 (RacketDetail)**: 5점~1점 별점 분포를 막대 그래프로 시각화.
- **태그 시스템**:
    - 목록: 상위 4개 노출 후 나머지는 숫자로 표시 (예: +5).
    - 상세 보기: 사용자 참여형 태그 입력 UI (플레이스홀더).

### 2.2. Tech Stack & Design
- **Frontend**: Vue 3 (Composition API, `<script setup>`, TypeScript)
- **Backend (Proposed)**: Supabase
    - `rackets`: 라켓 기본 정보
    - `tags`: 공통 마스터 태그 테이블
    - `racket_tag_map`: 라켓-태그 관계 매핑 테이블
- **Styling**: Tailwind CSS
- **Design Aesthetic**: 현대적이고 깔끔한 화이트/슬레이트 톤, 둥근 모서리(rounded-3xl), 깊이감 있는 그림자 효과.

## 3. Current Requested Plan & Steps

### Step 1: 데이터 모델 및 Mock 데이터 고도화 (완료)
- `appInfo.txt` 정의 필드 반영 및 평점 분포 데이터 시뮬레이션.

### Step 2: UI 컴포넌트 고도화 (완료)
- `RacketList.vue`: 필터링 및 초기 빈 화면 로직 적용.
- `RacketCard.vue`: 신분증 스타일 레이아웃 및 평점/태그 로직 적용.
- `RacketDetail.vue`: 상세 스펙 및 별점 그래프 모달 구현.

### Step 3: Supabase 연동 및 Auth 구현 (예정)
- 구글 로그인 연동 및 실제 DB 데이터 페칭.

---
마지막 업데이트: 2026-02-23
