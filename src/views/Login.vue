
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-10 space-y-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-6">
          <span class="text-4xl">🏸</span>
        </div>
        <h2 class="text-3xl font-black text-gray-900">환영합니다!</h2>
        <p class="mt-3 text-gray-500 font-medium leading-relaxed">
          배드민턴 장비 정보 플랫폼 BDMT입니다.<br>
          서비스 이용을 위해 로그인해 주세요.
        </p>
      </div>
      
      <div class="mt-10">
        <button
          @click="loginWithGoogle"
          class="group relative w-full flex items-center justify-center py-4 px-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-blue-200 transition-all duration-200"
        >
          <div class="absolute left-6">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.641-3.667-11.284-8.621L6.306,32.309C9.656,39.663,16.318,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.438,36.338,48,30.338,48,24c0-3.33-0.569-6.463-1.544-9.336L43.611,20.083z"></path>
            </svg>
          </div>
          Google 계정으로 시작하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '../supabase'

const loginWithGoogle = async () => {
  try {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
  }
};
</script>
