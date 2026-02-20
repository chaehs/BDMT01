<template>
  <div id="app" class="bg-gray-50 min-h-screen font-sans">
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <header class="mb-16 text-center">
        <h1 class="text-6xl font-extrabold text-gray-800 tracking-tighter">Racket Identification Card</h1>
        <p class="mt-4 text-xl text-gray-500">Official registry of high-performance badminton rackets.</p>
      </header>
      <RacketList />
    </main>
  </div>
</template>

<script setup>
import RacketList from './components/RacketList.vue';
</script>

<style>
/* Using a more professional and readable font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

#app {
  font-family: 'Inter', sans-serif;
   background-color: #f8f9fa; 
}
</style>
