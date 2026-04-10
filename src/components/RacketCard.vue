<template>
  <div class="group relative block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
    
    <!-- Top Section: Brand & Name -->
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase">{{ uppercasedBrand }}</span>
      </div>
      <h3 class="font-black text-gray-900 text-lg leading-tight break-keep">{{ racket.name }}</h3>
    </div>

    <!-- Middle Section: Image -->
    <div class="relative mb-4 group-hover:scale-[1.02] transition-transform duration-500">
      <div class="w-full aspect-square bg-gray-50/50 rounded-2xl border border-gray-50 flex items-center justify-center p-4">
        <img :src="imageUrl" @error="handleImageError" :alt="racket.name" class="w-full h-full object-contain drop-shadow-xl">
      </div>
    </div>

    <!-- Rating & Main Info Section -->
    <div class="space-y-4">
      <!-- Star Rating (Below Image) -->
      <div @click="toggleRatingPopover" class="flex items-center gap-2 bg-yellow-50/50 w-fit px-3 py-1.5 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors border border-yellow-100/50">
        <span class="text-yellow-400 text-sm">★</span>
        <span class="font-black text-gray-800 text-sm">{{ ratingStats.avg.toFixed(1) }}</span>
        <span class="text-[10px] text-yellow-600/60 font-bold">({{ ratingStats.count }} reviews)</span>
      </div>

      <!-- Specs Grid -->
      <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] font-bold text-gray-600 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/50">
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">Weight</span>
          <span>{{ uppercasedWeight || '-' }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">Flex</span>
          <span>{{ uppercasedFlex || '-' }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">Balance</span>
          <span>{{ uppercasedBalance || '-' }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">Length</span>
          <span>{{ racket.length ? racket.length + 'mm' : '-' }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">Max Tension</span>
          <span>{{ racket.max_tension ? racket.max_tension + ' lbs' : '-' }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-0.5">Grip Size</span>
          <span>{{ uppercasedGripSize || '-' }}</span>
        </div>
      </div>

      <!-- Colors Section -->
      <div v-if="racket.colors && racket.colors.length > 0" class="flex items-center gap-3 px-1">
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Colors</span>
        <div class="flex gap-2 flex-wrap">
          <div 
            v-for="(color, idx) in parsedColors" 
            :key="idx"
            @click="selectedColorName = color"
            class="w-5 h-5 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-125 transition-all duration-200"
            :class="{'ring-2 ring-blue-500 ring-offset-1 scale-110': selectedColorName === color}"
            :style="{ backgroundColor: mapColorToCSS(color) }"
            :title="color"
          ></div>
        </div>
      </div>
    </div>

    <!-- Tags Section -->
    <div class="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-1.5">
      <p v-if="!racket.tags || racket.tags.length === 0" class="text-xs text-gray-400 italic">No tags</p>
      <template v-else>
        <span v-for="tag in displayedTags" :key="tag.id" class="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">
          #{{ tag.name }}
        </span>
        <span v-if="remainingTagsCount > 0" class="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-black rounded-lg">
          +{{ remainingTagsCount }}
        </span>
      </template>
    </div>

    <!-- Rating Popover -->
    <div v-if="showRatingPopover" class="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-2xl p-4 z-50 animate-in fade-in duration-300" @click.self="toggleRatingPopover">
      <div class="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xs text-center">
        <h4 class="font-black text-gray-900 mb-4 text-sm leading-tight">"{{ racket.name }}"<br><span class="text-blue-500">별점 남기기</span></h4>
        <StarRating 
          :initial-rating="userRating || 0"
          @update:rating="handleRatingUpdate"
          class="justify-center mb-4"
        />
        <button @click="showRatingPopover = false" class="text-xs font-bold text-gray-400 hover:text-gray-600 underline">닫기</button>
        <p v-if="isLoading" class="text-[10px] text-blue-500 mt-2 font-black animate-pulse">SAVING...</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, toRefs, watch } from 'vue';
import { supabase } from '../supabase';
import useRatings from '../composables/useRatings';
import StarRating from './StarRating.vue';

const props = defineProps({
  racket: {
    type: Object,
    required: true
  }
});

const { racket } = toRefs(props);

// --- Ratings Logic ---
const { ratingStats, userRating, submitRating, isLoading } = useRatings(racket.value.id);
const showRatingPopover = ref(false);

const toggleRatingPopover = () => {
  if (!isLoading.value) { // Don't close while submitting
    showRatingPopover.value = !showRatingPopover.value;
  }
};

const handleRatingUpdate = async (newRating) => {
  await submitRating(newRating);
  setTimeout(() => {
    showRatingPopover.value = false;
  }, 500); // Show loading state briefly
};


// --- Computed Properties for Display ---
const parsedColors = computed(() => {
  const colors = racket.value.colors;
  if (!colors) return [];
  if (Array.isArray(colors)) return colors;
  if (typeof colors === 'string') {
    try {
      const parsed = JSON.parse(colors);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) {
      return colors.replace(/[{}"[\]]/g, '').split(',').map(c => c.trim()).filter(Boolean);
    }
  }
  return [];
});

const uppercasedBrand = computed(() => {
  return racket.value.brand ? racket.value.brand.toUpperCase() : '';
});

const uppercasedWeight = computed(() => {
  if (!racket.value.weight) return '';
  return String(racket.value.weight).toUpperCase();
});

const uppercasedFlex = computed(() => {
  if (!racket.value.flex) return '';
  return String(racket.value.flex).toUpperCase();
});

const uppercasedGripSize = computed(() => {
  if (!racket.value.grip_size) return '';
  return String(racket.value.grip_size).toUpperCase();
});

const uppercasedBalance = computed(() => {
  if (!racket.value.balance) return '';
  return String(racket.value.balance).toUpperCase();
});

const mapColorToCSS = (colorName) => {
  if (!colorName) return 'transparent';
  const c = colorName.trim().toLowerCase();
  const colorMap = {
    'red': '#ef4444',
    'blue': '#3b82f6',
    'black': '#1f2937',
    'white': '#ffffff',
    'navy': '#1e3a8a',
    'yellow': '#eab308',
    'green': '#22c55e',
    'orange': '#f97316',
    'purple': '#a855f7',
    'pink': '#ec4899',
    'silver': '#9ca3af',
    'gold': '#fbbf24',
    'grey': '#6b7280',
    'gray': '#6b7280',
    'cyan': '#06b6d4',
    'turquoise': '#14b8a6',
    'kurenai': '#c91f37',
    'magenta': '#d946ef',
    'lime': '#84cc16'
  };
  
  if (colorMap[c]) return colorMap[c];
  
  for (const [key, val] of Object.entries(colorMap)) {
    if (c.includes(key)) return val;
  }
  
  return c;
};

// --- Image URL Logic ---
const BUCKET_NAME = 'BDMT01';
const IMAGE_FOLDER = 'racket_storage';

const selectedColorName = ref('');
const imageLoadError = ref(false);

watch(selectedColorName, () => {
    imageLoadError.value = false;
});

const handleImageError = () => {
  if (selectedColorName.value) {
    imageLoadError.value = true;
  }
};

const imageUrl = computed(() => {
  if (!racket.value.image_url) {
    return `https://placehold.co/300x300/F3F4F6/9CA3AF?text=${racket.value.name}`;
  }
  if (racket.value.image_url.startsWith('http')) {
    return racket.value.image_url;
  }
  
  let fileName = racket.value.image_url;
  
  if (selectedColorName.value && !imageLoadError.value) {
     const extIdx = fileName.lastIndexOf('.');
     if (extIdx !== -1) {
       const base = fileName.substring(0, extIdx);
       const ext = fileName.substring(extIdx);
       // 공백을 제거하고 전부 소문자로 (예: Red -> _red)
       const colorSuffix = selectedColorName.value.replace(/\s+/g, '').toLowerCase();
       fileName = `${base}_${colorSuffix}${ext}`;
     }
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${IMAGE_FOLDER}/${fileName}`);
    
  return data.publicUrl;
});

// --- Tag Display Logic ---
const displayedTags = computed(() => {
    if (!racket.value.tags) return [];
    return racket.value.tags.slice(0, 3);
});

const remainingTagsCount = computed(() => {
    if (!racket.value.tags || racket.value.tags.length <= 3) return 0;
    return racket.value.tags.length - 3;
});

</script>

<style scoped>
.truncate-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>