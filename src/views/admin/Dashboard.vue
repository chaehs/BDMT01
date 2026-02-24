<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 shadow-2xl z-20">
      <div class="p-6 border-b border-gray-800">
        <h1 class="text-xl font-black tracking-tighter text-blue-400">BDMT01 ADMIN</h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-2 mt-4">
        <router-link 
          to="/admin" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold"
          :class="$route.name === 'AdminDashboard' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'"
        >
          <span>📊</span> 대시보드
        </router-link>
        
        <router-link 
          to="/admin/rackets" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold"
          :class="$route.path.includes('/admin/racket') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'"
        >
          <span>🏸</span> 라켓 관리
        </router-link>
      </nav>

      <div class="p-4 mt-auto border-t border-gray-800">
        <router-link to="/" class="text-xs text-gray-500 hover:text-white font-bold flex items-center gap-2">
          <span>←</span> 사용자 페이지로 이동
        </router-link>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 ml-64 p-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Dashboard scoped styles */
</style>
