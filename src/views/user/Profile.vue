<template>
  <div class="max-w-4xl mx-auto pb-20">
    <div class="mb-10">
      <h2 class="text-3xl font-black text-gray-900">내 프로필</h2>
      <p class="text-gray-500 font-medium mt-1">회원님의 정보와 배드민턴 성향을 설정해 주세요.</p>
    </div>

    <form @submit.prevent="updateProfile" class="space-y-8">
      <!-- 기본 정보 섹션 -->
      <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div class="flex items-center gap-3 border-b pb-4">
          <span class="text-xl">👤</span>
          <h3 class="text-lg font-black text-gray-800">기본 정보</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">닉네임</label>
            <input v-model="profile.nickname" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="닉네임을 입력하세요">
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">성별</label>
            <div class="flex gap-2">
              <button 
                type="button" 
                v-for="g in ['남성', '여성']" :key="g"
                @click="profile.gender = g"
                :class="[
                  'flex-1 py-3 rounded-xl font-bold border-2 transition-all',
                  profile.gender === g ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-500 hover:border-blue-100'
                ]"
              >
                {{ g }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 플레이 성향 섹션 -->
      <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div class="flex items-center gap-3 border-b pb-4">
          <span class="text-xl">🏸</span>
          <h3 class="text-lg font-black text-gray-800">플레이 성향</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">급수 (레벨)</label>
            <select v-model="profile.level" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold">
              <option value="">선택하세요</option>
              <option v-for="opt in levelOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">선호 포지션</label>
            <div class="flex gap-2">
              <button 
                type="button" 
                v-for="p in ['전위', '올라운드', '후위']" :key="p"
                @click="profile.pref_position = p"
                :class="[
                  'flex-1 py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all',
                  profile.pref_position === p ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-500 hover:border-blue-100'
                ]"
              >
                {{ p }}
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">선호 밸런스</label>
            <select v-model="profile.pref_balance" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold">
              <option value="HEAD LIGHT">HEAD LIGHT (수비/빠름)</option>
              <option value="EVEN BALANCE">EVEN BALANCE (공수겸용)</option>
              <option value="HEAD HEAVY">HEAD HEAVY (공격/파워)</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">주력 라켓 (사용 중인 라켓)</label>
            <input v-model="profile.main_racket" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="예: 요넥스 아스트록스 100ZZ">
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">선호 무게</label>
            <select v-model="profile.pref_weight" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold">
              <option value="">선택하세요</option>
              <option value="3U">3U (85-89g)</option>
              <option value="4U">4U (80-84g)</option>
              <option value="5U">5U (75-79g)</option>
              <option value="F">F (70-74g)</option>
            </select>
          </div>
        </div>
      </section>

      <!-- 저장 버튼 -->
      <div class="flex gap-4">
        <button 
          type="button" 
          @click="$router.push('/')" 
          class="flex-1 py-4 bg-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-300 transition-all"
        >
          취소
        </button>
        <button 
          type="submit" 
          :disabled="isSaving"
          class="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
        >
          {{ isSaving ? '저장 중...' : '프로필 정보 저장' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { supabase } from '../../supabase';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isSaving = ref(false);

const profile = reactive({
  nickname: '',
  level: '',
  role: 'user',
  main_racket: '',
  pref_weight: '',
  pref_balance: 'EVEN BALANCE',
  pref_position: '올라운드',
  gender: '남성'
});

const levelOptions = [
  { value: 'S', text: 'S (자강)' },
  { value: 'A', text: 'A' },
  { value: 'B', text: 'B' },
  { value: 'C', text: 'C' },
  { value: 'D', text: 'D' },
  { value: 'E', text: 'E (초심)' },
  { value: 'F', text: 'F (왕초심)' },
  { value: 'N', text: 'N (비동호인)' },
];

onMounted(async () => {
  if (authStore.user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authStore.user.id)
      .single();

    if (profileData) {
      Object.assign(profile, profileData);
    }
  }
});

const updateProfile = async () => {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    if (!authStore.user) throw new Error('로그인이 필요합니다.');

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', authStore.user.id);

    if (error) throw error;
    
    alert('프로필이 성공적으로 저장되었습니다.');
    router.push('/');
  } catch (err) {
    console.error('Error updating profile:', err);
    alert(`프로필 저장 실패: ${err.message}`);
  } finally {
    isSaving.value = false;
  }
};
</script>
