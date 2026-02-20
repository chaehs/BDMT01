/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // src 내부의 모든 vue 파일을 감시해야 함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}