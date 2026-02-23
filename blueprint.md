# Badminton Racket Review App Blueprint (BDMT01)

## 1. Project Overview

This project is a platform for badminton enthusiasts to access detailed racket specifications, real-time user tags, and ratings. It is designed with scalability and versatility in mind, with the ultimate goal of launching a hybrid app.

## 2. Implemented Features & Design

### 2.1. Core Functionality

- **Racket List & Filtering**:
  - The initial screen is kept empty to optimize data loading, with a UI that encourages searching.
  - A filtering system for brands (Yonex, Victor, etc.), weights (3U, 4U, etc.), and tags has been implemented.

- **Racket Card (ID-Card Style)**:
  - A two-column layout is applied.
  - Specs include: brand, name, weight, balance, shaft flex, max tension, grip size, frame shape, and representative colors (indicated by dots).

- **Rating System**:
  - In the list view, ratings are displayed as: ★ 4.7 (26).
  - In the **detail view (RacketDetail)**, the distribution of ratings from 5 stars to 1 star is visualized with a bar chart.

- **Tag System**:
  - In the list view, the top 4 tags are shown, with the rest indicated by a number (e.g., +5).
  - The detail view includes a UI for user-submitted tags (placeholder).

### 2.2. Backend & Data

- **Data Source**: The application is now connected to a real-time **Supabase database**.
  - Mock data has been completely removed.
  - The front-end components now directly use the `snake_case` column names from the Supabase `rackets` table (e.g., `review_count`, `max_tension`).

### 2.3. Tech Stack & Design

- **Frontend**: Vue 3 (Composition API, `<script setup>`, TypeScript)
- **Backend**: Supabase
  - Tables: `rackets`, `tags`, `racket_tag_map`
- **Styling**: Tailwind CSS
- **Design Aesthetic**: A modern and clean white/slate color scheme, with rounded corners (rounded-3xl) and deep shadow effects for a sense of depth.

## 3. Current Requested Plan & Steps

### Step 1: Enhance Data Model & Mock Data (Completed)
- Reflected the fields defined in `appInfo.txt` and simulated rating distribution data.

### Step 2: Refine UI Components (Completed)
- `RacketList.vue`: Applied filtering and initial empty screen logic.
- `RacketCard.vue`: Implemented the ID-card style layout and rating/tag logic.
- `RacketDetail.vue`: Implemented the detailed spec and star rating graph modal.

### Step 3: Integrate Supabase & Implement Auth (In Progress)
- **[✓] Fetched real data from the Supabase `rackets` table.**
- **[✓] Aligned front-end property names (`snake_case`) with database column names for consistency.**
- **[ ] Implement Google login and user-specific interactions.**

---
Last Updated: 2026-02-23
