<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 flex flex-col h-full hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
    <!-- Subtle background texture effect -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

    <!-- Header Area -->
    <div class="mb-3 relative z-10 flex justify-between items-start">
      <div>
        <span class="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 border border-blue-100">
          {{ racket.brand }}
        </span>
        <h3 class="text-xl font-black text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
          {{ racket.name }}
        </h3>
      </div>
      <!-- Rating Display: ★ 4.7 (26) -->
      <div class="flex items-center bg-yellow-400 px-2.5 py-1.5 rounded-xl shadow-sm border border-yellow-500/20">
        <span class="text-white text-xs mr-1">★</span>
        <span class="text-xs font-black text-white">{{ racket.rating }}</span>
        <span class="text-[10px] text-yellow-100/80 ml-1 font-bold">({{ racket.review_count }})</span>
      </div>
    </div>

    <!-- Main Content Area: Image (Left) & Specs (Right) -->
    <div class="flex gap-4 mb-4 relative z-10 flex-1 min-h-0">
      <!-- Image Area (ID Card Style) -->
      <div class="w-[35%] aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center p-2 relative group-hover:scale-[1.02] transition-transform duration-500">
        <img :src="racketImageUrl" @error="handleImageError" class="w-full h-full object-contain drop-shadow-md" :alt="racket.name" />
        <div class="absolute bottom-2 left-2 right-2 flex gap-1 justify-center">
          <div v-for="color in (racket.colors || []).slice(0, 2)" :key="color" 
               class="w-2.5 h-2.5 rounded-full border border-white shadow-sm"
               :style="{ backgroundColor: color }"></div>
        </div>
      </div>

      <!-- Racket Specs Area (Key info layout) -->
      <div class="flex-1 flex flex-col justify-between py-1">
        <div class="grid grid-cols-1 gap-y-1.5">
          <div v-for="spec in specs" :key="spec.label" class="flex items-center justify-between text-[11px] border-b border-gray-50 pb-1">
            <span class="text-gray-400 font-medium">{{ spec.label }}</span>
            <span class="font-bold text-gray-800">{{ spec.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags Area & Detail Button -->
    <div class="mt-auto relative z-10 pt-3 border-t border-gray-100">
      <div class="flex flex-wrap items-center gap-1.5 mb-3 min-h-[28px]">
        <span v-for="tag in displayedTags" :key="tag" 
          class="inline-flex items-center justify-center text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
          #{{ tag }}
        </span>
        <span v-if="remainingTagsCount > 0" class="text-[9px] font-bold text-blue-500 ml-0.5">
          +{{ remainingTagsCount }}
        </span>
      </div>

      <button 
        @click="$emit('open-detail', racket)"
        class="w-full py-2.5 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-black text-gray-500 transition-all border border-gray-100 hover:border-blue-600 shadow-sm"
      >
        상세보기
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  racket: {
    type: Object,
    required: true
  }
});

defineEmits(['open-detail'])

const racketImageUrl = computed(() => {
  const path = props.racket.image_url;
  if (!path) return defaultImageUrl.value;
  if (path.startsWith('http')) return path;

  const { data } = supabase.storage
    .from('BDMT01')
    .getPublicUrl(`RACKETS/${path}`);
  
  return data.publicUrl;
});

const defaultImageUrl = computed(() => {
  const { data } = supabase.storage
    .from('BDMT01')
    .getPublicUrl('RACKETS/DEFAULT_RACKET.png'); // 소문자로 변경
  return data.publicUrl;
});

const handleImageError = (e) => {
  // 이미 기본 이미지인데도 에러가 나면 더미 이미지로 교체 (무한 루프 방지)
  if (e.target.src !== defaultImageUrl.value) {
    e.target.src = defaultImageUrl.value;
  } else {
    e.target.src = 'https://placehold.co/400x600?text=No+Image';
  }
};

const specs = computed(() => [
  { label: '무게', value: props.racket.weight },
  { label: '밸런스', value: props.racket.balance },
  { label: '탄성', value: props.racket.flex },
  { label: '최대장력', value: props.racket.max_tension },
  { label: '그립두께', value: props.racket.grip_size },
  { label: '프레임', value: props.racket.frame_shape }
])

const displayedTags = computed(() => {
  return (props.racket.tags || []).slice(0, 4)
})

const remainingTagsCount = computed(() => {
  return Math.max(0, (props.racket.tags || []).length - 4)
})
</script>