# Blueprint: Badminton Racket Review Platform (BDMT01)

## 1. Project Goal

A web application for badminton players to easily search for racket information, check real user reviews and ratings, and share their own feedback.

---

## 2. Core Features & UI/UX

### 2.1. Main Page (`RacketList.vue`)

- **Initial State**: To minimize initial data transfer, the screen starts empty. It prompts users to select filters or search to load the racket list.
- **Filtering**:
    - **Brand**: Dropdown menu (e.g., YONEX, VICTOR, LI-NING).
    - **Weight**: Dropdown menu (e.g., 3U, 4U, 5U).
    - **Balance**: Dropdown for HEAD LIGHT, EVEN BALANCE, HEAD HEAVY.
    - **Flex**: Dropdown for FLEXIBLE, MEDIUM, STIFF, EXTRA STIFF.
    - **Tags**: Users can select from popular tags or search for them.
- **Search**: A search bar for finding rackets by name.
- **Racket List**: A grid of `RacketCard` components.

### 2.2. Racket Card (`RacketCard.vue`)

- **Design**: An "ID Card" style layout.
    - **Left Side**: Racket image.
    - **Right Side**: Key specifications.
- **Displayed Information**:
    - Brand, Name.
    - **Rating**: Displayed in the format: `★ 4.7 (26)`.
    - **Tags**: Shows the top 4 most-voted tags. If there are more, they are indicated with `+n` (e.g., "+5").
    - Key specs like Weight, Balance, etc.

### 2.3. Detail Modal (`RacketDetail.vue`)

- **Activation**: Opens as a modal window when a `RacketCard` is clicked.
- **Content**:
    - **Rating Distribution**: A bar chart visualizing the number of reviews for each star rating (1 to 5 stars).
    - **Full Specifications**: All data from the `rackets` table.
    - **Tag Input**: A UI for users to add their own tags to the racket. An autocomplete feature will assist with tag entry.

### 2.4. Admin Page (`Dashboard.vue`)

- **Purpose**: A dedicated page for administrators to manage racket data (CRUD operations).

---

## 3. Technical Specifications

### 3.1. Tech Stack

- **Frontend**: Vue.js 3 with Vite (Composition API, `<script setup>`, TypeScript).
- **Styling**: Tailwind CSS.
- **Backend & DB**: Supabase.
- **Deployment**: GitHub repository linked to Cloudflare for CI/CD.

### 3.2. Database Schema (Supabase)

- **`rackets` table**:
    - `id`, `brand`, `name`, `weight`, `balance`, `flex`, `max_tension`, `grip_size`, `frame_shape`, `image_url`, `rating_avg`, `review_count`, `rating_distribution` (JSON).
- **`tags` table**:
    - `id`, `name` (unique).
- **`racket_tag_map` table**:
    - `racket_id`, `tag_id`, `user_id` (to track who added the tag).
- **`colors` table**:
    - `id`, `name`, `hex_code`.
- **`racket_color_map` table**:
    - `racket_id`, `color_id`.

### 3.3. Project Structure

- **`src/views`**: Contains main page components (`RacketList.vue`, `Dashboard.vue`). Organized into `user` and `admin` subdirectories.
- **`src/components`**: Contains reusable, smaller components (`RacketCard.vue`, `RacketDetail.vue`).

### 3.4. Authentication

- **Initial Method**: Google Login via Supabase Auth.
- **Future Expansion**: Other social logins can be added later.

---

## 4. Development Plan & History

- **[✓] Initial Project Setup**: Vue 3 + Vite + TypeScript.
- **[✓] Component Creation**: Created `RacketList`, `RacketCard`, `RacketDetail`, and `Admin`.
- **[✓] UI/UX Mockup**: Implemented the basic layout and styling for all components.
- **[✓] File Structure Refactoring**: Organized page components into `src/views` and reusable components into `src/components`. Renamed `Admin.vue` to `Dashboard.vue`.
- **[✓] Supabase Integration**: Connected the app to Supabase and fetched initial racket data.
- **[✓] Implement Initial Screen Logic**: Modified `RacketList.vue` to be empty initially and load data based on user filter/search actions.
- **[✓] Enhanced Filtering**: Added `balance` and `flex` filters. Standardized all filter options to uppercase.
- **[✓] Basic Admin Form Submission**: Fixed a bug in the admin form to allow saving and updating basic racket information (excluding tags and colors) to the Supabase `rackets` table.
- **[Up Next] Implement Google Login**: Integrate Supabase Authentication for user-specific interactions.
- **[Postponed] Advanced Form Logic**: Implement saving for racket tags and colors, which involves multiple table interactions (`tags`, `colors`, `racket_tag_map`, `racket_color_map`).
