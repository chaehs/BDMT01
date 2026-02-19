# Badminton Racket Review App Blueprint

## 1. Project Overview

This project is a web application designed to provide badminton players with detailed information and user-generated reviews for badminton rackets. It aims to be a comprehensive resource for players of all levels to discover, compare, and select the best racket for their playing style. Users can search for rackets, filter them by specifications, read reviews, and contribute their own feedback through ratings and descriptive tags. The application will feature a modern, intuitive, and responsive interface, ensuring a seamless experience across both desktop and mobile devices.

## 2. Implemented Features & Design

This section documents the current state of the application, including all style, design, and features implemented from the initial version to the current version.

### 2.1. Core Functionality

*   **Racket Information:** Displays detailed specifications for each racket, including brand, weight, balance, shaft flexibility, and recommended tension.
*   **User Reviews & Tagging:**
    *   Users can add descriptive tags to rackets (e.g., `#head-heavy`, `#for-beginners`, `#good-sound`, `#clear-is-easy`).
    *   Users can rate rackets with a simple "Like", "Neutral", or "Dislike" system.
*   **Search & Filtering:**
    *   A primary search functionality allowing users to find rackets by searching for specific tags.
    *   Advanced filtering options to narrow down racket selection based on brand, weight, and other key specifications.
*   **Authentication:** Secure user authentication using Google Sign-In, allowing users to contribute reviews and manage their profile.

### 2.2. Tech Stack

*   **Frontend:** Vue.js 3 with Composition API and TypeScript.
*   **Backend & Database:** Supabase for database management, authentication, and backend services.
    *   **Tables:** `rackets` (for racket specifications), `racket_tags` (for user-generated tags), and `rackets-tags` (a join table).
*   **Styling:** Tailwind CSS for a utility-first approach to styling.
*   **Development Environment:** Firebase Studio (formerly Project IDX).
*   **Deployment:** Cloudflare for global content delivery.

### 2.3. Design & Style

*   **Layout:** A modern, clean, and responsive layout that ensures a great user experience on all devices.
*   **Components:**
    *   **Racket Card View:** A compact, visually appealing card to display a summary of each racket in list views.
    *   **Racket Detail View:** A dedicated page providing a comprehensive overview of a racket's specifications, user reviews, and tags.
*   **Visuals:** High-quality images for rackets and a visually balanced design (further details to be defined).

## 3. Current Task: Initial Project Setup

This section outlines the plan for the current development task. All items in this section have been completed.

### 3.1. Goal

Set up the initial Vue.js project structure, install necessary dependencies (Tailwind CSS, Supabase client), and create placeholder components for the main features.

### 3.2. Plan (Completed)

1.  **Initialize Project:** Confirmed the Vue.js project is set up and running.
2.  **Install Dependencies:**
    *   Installed `tailwindcss`, `postcss`, and `autoprefixer`.
    *   Initialized Tailwind CSS configuration.
    *   Installed the `@supabase/supabase-js` library.
3.  **Create Blueprint:** Created this `blueprint.md` file to document the project plan and progress.
4.  **Project Structure:**
    *   Created `components` directory.
    *   Created `views` directory.
    *   Created `composables` directory.
5.  **Initial UI:**
    *   Modified `App.vue` for a basic layout.
    *   Created `Header.vue` with app title and navigation placeholders.
