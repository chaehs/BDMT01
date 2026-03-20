<template>
  <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">프로필</h1>
      <div v-if="user">
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div>
            <p class="text-sm font-medium text-gray-500">이메일</p>
            <p class="mt-1 text-lg text-gray-900">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">가입일</p>
            <p class="mt-1 text-lg text-gray-900">{{ new Date(user.created_at).toLocaleDateString() }}</p>
          </div>

          <!-- 닉네임 -->
          <div>
            <label for="nickname" class="block text-sm font-medium text-gray-700">닉네임</label>
            <input type="text" id="nickname" v-model="profile.nickname" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="닉네임을 입력하세요">
          </div>

          <!-- 성별 -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">성별</label>
            <select id="gender" v-model="profile.gender" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option :value="null" disabled>선택하세요</option>
              <option value="M">남</option>
              <option value="F">여</option>
            </select>
          </div>

          <!-- 급수 -->
          <div>
            <label for="level" class="block text-sm font-medium text-gray-700">급수</label>
            <select id="level" v-model="profile.level" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option :value="null" disabled>선택하세요</option>
              <option value="S">S</option>
              <option value="AA">AA</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="X">X</option>
            </select>
          </div>

          <!-- 사용라켓 -->
          <div>
            <label for="main_racket" class="block text-sm font-medium text-gray-700">주력 라켓</label>
            <input type="text" id="main_racket" v-model="profile.main_racket" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          </div>

          <!-- 선호 무게 -->
          <div>
            <label for="pref_weight" class="block text-sm font-medium text-gray-700">선호 무게</label>
            <select id="pref_weight" v-model="profile.pref_weight" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option :value="null" disabled>선택하세요</option>
              <option value="3U">3U</option>
              <option value="4U">4U</option>
              <option value="5U">5U</option>
              <option value="6U">6U</option>
              <option value="7U">7U</option>
            </select>
          </div>

          <!-- 선호 밸런스 -->
          <div>
            <label for="pref_balance" class="block text-sm font-medium text-gray-700">선호 밸런스</label>
            <select id="pref_balance" v-model="profile.pref_balance" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option :value="null" disabled>선택하세요</option>
              <option value="hh">Head Heavy</option>
              <option value="eb">Even Balance</option>
              <option value="hl">Head Light</option>
            </select>
          </div>

          <!-- 선호 포지션 -->
          <div>
            <label for="pref_position" class="block text-sm font-medium text-gray-700">선호 포지션</label>
            <select id="pref_position" v-model="profile.pref_position" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option :value="null" disabled>선택하세요</option>
              <option value="front">Front</option>
              <option value="back">Back</option>
              <option value="all">All</option>
            </select>
          </div>
          
          <div class="pt-4">
            <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              <span v-if="loading">저장 중...</span>
              <span v-else>프로필 저장</span>
            </button>
          </div>
        </form>

        <div v-if="successMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>

      </div>
      <div v-else>
        <p>로그인 정보가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'

const user = ref(null)
const profile = ref({
  nickname: '',
  gender: null,
  level: null,
  main_racket: '',
  pref_weight: null,
  pref_balance: null,
  pref_position: null,
})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function fetchProfile() {
  const { data: userData } = await supabase.auth.getUser()
  if (userData.user) {
    user.value = userData.user

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error && error.code !== 'PGRST116') { 
      errorMessage.value = '프로필 정보를 불러오는 중 오류가 발생했습니다.'
      console.error(error)
    } else if (profileData) {
      profile.value = { ...profile.value, ...profileData };
    }
  } 
}

async function updateProfile() {
  if (!user.value) return

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const profileData = {
    id: user.value.id,
    ...profile.value,
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'id' })

  if (error) {
    errorMessage.value = '프로필 업데이트 중 오류가 발생했습니다.'
    console.error('Error updating profile:', error)
  } else {
    successMessage.value = '프로필이 성공적으로 저장되었습니다.'
    fetchProfile();
  }
  loading.value = false
}

onMounted(() => {
  fetchProfile()
})
</script>
