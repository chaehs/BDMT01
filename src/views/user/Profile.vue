<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">프로필 수정</h1>
    <form @submit.prevent="updateProfile" class="space-y-4">
      <div>
        <label for="nickname" class="block text-sm font-medium text-gray-700">닉네임</label>
        <input type="text" id="nickname" v-model="nickname" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label for="level" class="block text-sm font-medium text-gray-700">급수</label>
        <select id="level" v-model="level" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="">선택하세요</option>
          <option v-for="option in levelOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        저장
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const nickname = ref('');
const level = ref('');
const user = ref(null);

const levelOptions = [
  { value: 'S', text: 'S (자강)' },
  { value: 'A+', text: 'A+' },
  { value: 'A', text: 'A' },
  { value: 'B', text: 'B' },
  { value: 'C', text: 'C' },
  { value: 'D', text: 'D' },
  { value: 'E', text: 'E (초심)' },
  { value: 'F', text: 'F (왕초심)' },
  { value: 'N', text: 'N (비동호인)' },
];

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    user.value = session.user;
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('nickname, level')
      .eq('id', user.value.id)
      .single();

    if (profile) {
      nickname.value = profile.nickname;
      level.value = profile.level;
    }
  }
});

const updateProfile = async () => {
  if (!nickname.value || !level.value) {
    alert('닉네임과 급수를 모두 입력해주세요.');
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: nickname.value,
      level: level.value,
    })
    .eq('id', user.value.id);

  if (error) {
    alert('프로필 업데이트에 실패했습니다.');
    console.error('Error updating profile:', error);
  } else {
    alert('프로필이 업데이트되었습니다.');
    router.push('/');
  }
};
</script>

<style scoped>
</style>
