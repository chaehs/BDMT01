<template>
  <div class="bg-gray-100 min-h-screen font-sans">
    <header class="bg-white shadow-md">
      <nav class="max-w-screen-xl mx-auto px-4 md:px-10 py-4 flex justify-between items-center">
        <div class="text-2xl font-bold text-gray-800">
          <router-link to="/">BDMT</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 관리자 역할이 'admin'인 경우에만 이 버튼을 보여줍니다. -->
          <router-link 
            :to="{ name: 'AdminDashboard' }" 
            v-if="user && user.user_metadata.role === 'admin'"
            class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            관리자
          </router-link>
          <div v-if="user">
            <span class="text-gray-600">{{ user.email }}</span>
            <button @click="handleLogout" class="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
              로그아웃
            </button>
          </div>
          <div v-else>
            <router-link to="/login" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              로그인
            </router-link>
          </div>
        </div>
      </nav>
    </header>
    <main class="max-w-screen-xl mx-auto px-4 md:px-10 py-10">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import useRackets from './composables/useRackets'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/')
}

const racketFunctions = useRackets()
provide('rackets', racketFunctions)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
body {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
