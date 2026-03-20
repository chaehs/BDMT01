<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div class="text-2xl font-bold text-gray-800 tracking-tight">
          <router-link to="/" class="hover:text-blue-600 transition-colors">BDMT</router-link>
        </div>
        <div class="flex items-center space-x-5">
          <!-- Admin Button -->
          <router-link 
            :to="{ name: 'AdminDashboard' }" 
            v-if="isAdmin"
            class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            관리자
          </router-link>
          
          <!-- User Actions -->
          <div v-if="user" class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 hidden sm:inline">{{ user.email }}</span>
            
            <!-- Profile Button -->
            <router-link 
              :to="{ name: 'Profile' }"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-200 transition-all shadow-sm"
            >
              프로필
            </router-link>
            
            <!-- Logout Button -->
            <button 
              @click="handleLogout" 
              class="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition-all shadow-sm"
            >
              로그아웃
            </button>
          </div>
          
          <!-- Login Button -->
          <div v-else>
            <router-link 
              :to="{ name: 'Login' }" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm"
            >
              로그인
            </router-link>
          </div>
        </div>
      </nav>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import useRackets from './composables/useRackets'

const { user, isAdmin, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  alert('성공적으로 로그아웃되었습니다.')
  router.push('/')
}

const racketFunctions = useRackets()
provide('rackets', racketFunctions)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
body {
  font-family: 'Noto Sans KR', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
