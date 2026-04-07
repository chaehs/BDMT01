# BDMT 프로젝트 청사진 (Blueprint)

## 1. 프로젝트 개요
배드민턴 라켓 정보 및 리뷰 플랫폼으로, 사용자가 본인의 성향에 맞는 라켓을 검색하고 상세 정보를 확인할 수 있는 서비스입니다.

## 2. 기술 스택
- **Frontend**: Vue 3 (Composition API), Vite
- **State Management**: **Pinia** (전역 상태 관리 도입)
- **Styling**: Tailwind CSS 4.0
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: Vue Router

## 3. 데이터베이스 구조 (Supabase)

### 3.1 `profiles` 테이블
- 사용자의 기본 정보 및 배드민턴 성향 저장.
- 주요 컬럼: `nickname`, `level`, `gender`, `role`, `main_racket`, `pref_weight`, `pref_balance`, `pref_position`.
- **선호 포지션 옵션**: `전위`, `올라운드`, `후위` (기존 '공격형', '수비형' 제외)

### 3.2 `rackets` 테이블
- 라켓 상세 스펙 및 이미지 정보 저장.
- 주요 컬럼: `brand`, `name`, `weight`, `balance`, `flex`, `max_tension`, `image_url`, `avg_rating`, `review_count`.

## 4. 현재 구현된 주요 기능 및 상태
1. **Pinia 전역 상태 관리**: 
   - `AuthStore`: 로그인 유저 정보 및 관리자 권한(`role === 'admin'`) 관리.
   - `RacketStore`: 라켓 목록 조회, 이미지 처리, 삭제 로직 통합.
2. **라켓 필터링 및 검색**: 
   - 브랜드, 무게, 밸런스, 탄성, 이름 검색 기능 제공.
   - **태그 필터**: 현재 DB 관계(Foreign Key) 미설정으로 인해 UI는 유지하되 기능은 일시 비활성화됨.
3. **프로필 관리**: 사용자 성향 설정 페이지 완성.
4. **관리자 페이지**: 라켓 목록 관리 및 CRUD 기반 구축.

## 5. 진행 중인 작업 및 향후 계획
### 5.1 진행 중인 작업 - 라켓 태그 입력 기능 (현재 작업 중)
- **목표**: 라켓 등록 및 수정 시 태그를 자유롭게 입력하고 관리할 수 있는 기능 구현.
- **상세**:
    - `RacketForm.vue`에 태그 입력 UI 추가.
    - 입력 시 자동완성 기능 및 칩(Chip) 형태의 태그 표시.
    - `racket_tag_map` 테이블을 통한 다대다 관계 저장 로직 구현.

### 5.2 향후 계획 및 해결 과제
- **태그 필터링 활성화**: 저장된 태그 데이터를 기반으로 메인 페이지의 태그 필터 기능 재활성화.
- **이미지 업로드 고도화**: 관리자 페이지에서 라켓 등록 시 이미지 업로드 및 자동 파일명 생성 기능 고도화.
- **상세 페이지**: 라켓별 리뷰 작성 및 별점 통계 기능 추가.
