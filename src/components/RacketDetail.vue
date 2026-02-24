<template>
  <!-- Full-screen modal overlay -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center backdrop-blur-sm" @click.self="close">

    <!-- Modal Content -->
    <div class="relative bg-gradient-to-br from-gray-50 to-white w-[90%] max-w-4xl h-[90vh] max-h-[700px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t border-white/20">
      <!-- Close Button -->
      <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:bg-gray-200 rounded-full p-2 z-20 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <!-- Main Content Layout -->
      <div class="flex-1 flex flex-col md:flex-row gap-6 p-6 md:p-8 overflow-y-auto">
        
        <!-- Left Column: Image & Main Info -->
        <div class="w-full md:w-1/3 flex flex-col items-center">
          <div class="w-full aspect-[3/4] bg-white rounded-2xl shadow-inner border border-gray-200 p-4 mb-6">
            <img :src="racketImageUrl" @error="handleImageError" :alt="racket.name" class="w-full h-full object-contain drop-shadow-lg">
          </div>
          <h1 class="text-3xl font-black text-gray-900 text-center leading-tight tracking-tight">{{ racket.name }}</h1>
          <p class="text-lg font-bold text-gray-500">{{ racket.brand }}</p>
          <div class="flex items-center mt-3 bg-yellow-400 text-white px-3 py-1.5 rounded-full shadow-md">
            <span class="text-yellow-100 mr-1">★</span>
            <span class="font-black text-lg">{{ racket.rating }}</span>
            <span class="text-sm ml-2 font-medium opacity-80">({{ racket.review_count }} reviews)</span>
          </div>
        </div>

        <!-- Right Column: Details & Ratings -->
        <div class="w-full md:w-2/3 space-y-6">
          
          <!-- Main Specifications -->
          <div class="bg-white/60 p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Specifications</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              <div v-for="spec in specs" :key="spec.label">
                <p class="text-xs text-gray-500 font-medium">{{ spec.label }}</p>
                <p class="text-md font-bold text-gray-800">{{ spec.value }}</p>
              </div>
            </div>
          </div>

          <!-- Rating Distribution -->
          <div class="bg-white/60 p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Rating Distribution</h2>
            <div class="space-y-2">
              <div v-for="dist in racket.rating_distribution" :key="dist.stars" class="flex items-center gap-3">
                <span class="text-xs font-bold text-gray-500">{{ dist.stars }} stars</span>
                <div class="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div class="bg-yellow-400 h-2.5 rounded-full" :style="{ width: getRatingPercentage(dist.count) + '%' }"></div>
                </div>
                <span class="text-xs font-mono text-gray-500 w-8 text-right">{{ dist.count }}</span>
              </div>
            </div>
          </div>

          <!-- User Tags -->
          <div class="bg-white/60 p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">User Tags</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in racket.tags" :key="tag" class="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                #{{ tag }}
              </span>
              <span v-if="!racket.tags || racket.tags.length === 0" class="text-sm text-gray-500 italic">
                No tags yet.
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  isOpen: Boolean,
  racket: Object
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const racketImageUrl = computed(() => {
  if (!props.racket || !props.racket.image_url) return defaultImageUrl.value;
  const path = props.racket.image_url;
  
  if (path.startsWith('http')) return path;

  const { data } = supabase.storage
    .from('BDMT01')
    .getPublicUrl(`RACKETS/${path}`);
  
  return data.publicUrl;
});

const defaultImageUrl = computed(() => {
  const { data } = supabase.storage
    .from('BDMT01')
    .getPublicUrl('RACKETS/DEFAULT_RACKET.png');
  // 캐시 문제를 해결하기 위해 타임스탬프 추가
  return `${data.publicUrl}?t=${new Date().getTime()}`;
});

const handleImageError = (e) => {
  const baseDefaultPath = 'RACKETS/DEFAULT_RACKET.png';
  // 기본 이미지로 무한 대체되는 것을 방지
  if (!e.target.src.includes(baseDefaultPath)) {
    e.target.src = defaultImageUrl.value;
  } else {
    // 기본 이미지조차 실패하면 플레이스홀더 표시
    e.target.src = 'https://placehold.co/400x600?text=No+Image';
  }
};

const totalReviews = computed(() => {
  if (!props.racket || !props.racket.rating_distribution) return 1;
  return props.racket.rating_distribution.reduce((acc, dist) => acc + dist.count, 0) || 1;
});

const getRatingPercentage = (count) => {
  return (count / totalReviews.value) * 100;
};

const specs = computed(() => [
  { label: '무게', value: props.racket?.weight || 'N/A' },
  { label: '밸런스', value: props.racket?.balance || 'N/A' },
  { label: '탄성', value: props.racket?.flex || 'N/A' },
  { label: '최대장력', value: props.racket?.max_tension || 'N/A' },
  { label: '그립두께', value: props.racket?.grip_size || 'N/A' }
]);

</script>
