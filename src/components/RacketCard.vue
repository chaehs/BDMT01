<template>
  <div class="group relative block bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    
    <!-- Top Section: Image + Specs -->
    <div class="flex gap-5">
      <!-- Left: Image -->
      <div class="w-1/3 flex-shrink-0">
        <div class="relative overflow-hidden rounded-lg pt-[100%]">
          <img :src="imageUrl" @error="handleImageError" :alt="racket.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
        </div>
      </div>

      <!-- Right: Specs -->
      <div class="w-2/3">
        <div class="bg-gray-800 text-white text-sm font-bold px-2.5 py-1 rounded-full inline-block mb-2">{{ uppercasedBrand }}</div>
        <div class="flex items-start justify-between">
          <div class="flex-grow">
            <h3 class="font-bold text-gray-900 text-lg leading-tight truncate-2-lines">{{ racket.name }}</h3>
          </div>
          <div @click="toggleRatingPopover" class="flex-shrink-0 flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full ml-2 cursor-pointer hover:bg-yellow-100 transition-colors">
              <span class="text-yellow-400">★</span>
              <span class="font-bold text-gray-800 text-sm">{{ ratingStats.avg.toFixed(1) }}</span>
              <span class="text-sm text-gray-500">({{ ratingStats.count }})</span>
          </div>
        </div>
        
        <div class="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-sm font-medium text-gray-700">
          <p><span class="font-semibold text-gray-500">무게:</span> {{ uppercasedWeight }}</p>
          <p><span class="font-semibold text-gray-500">탄성:</span> {{ uppercasedFlex }}</p>
          <p><span class="font-semibold text-gray-500">최대장력:</span> {{ racket.max_tension || '' }}</p>
          <p><span class="font-semibold text-gray-500">그립:</span> {{ uppercasedGripSize }}</p>
          <p><span class="font-semibold text-gray-500">밸런스:</span> {{ uppercasedBalance }}</p>
          <p><span class="font-semibold text-gray-500">B.P:</span> {{ racket.bal_point ? racket.bal_point + 'mm' : '' }}</p>
        </div>

        <!-- 색상 표시 -->
        <div v-if="racket.colors && racket.colors.length > 0" class="mt-3.5 flex items-center gap-2">
          <span class="font-semibold text-sm text-gray-500">색상:</span>
          <div class="flex gap-1.5 flex-wrap">
            <div 
              v-for="(color, idx) in parsedColors" 
              :key="idx"
              @click="selectedColorName = color"
              class="w-4 h-4 rounded-full border border-gray-300 shadow-sm cursor-pointer hover:scale-125 hover:shadow-md transition-all duration-200"
              :class="{'ring-2 ring-blue-500 ring-offset-1 scale-125': selectedColorName === color}"
              :style="{ backgroundColor: mapColorToCSS(color) }"
              :title="color"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Tags -->
    <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div class="flex flex-wrap gap-1.5 flex-grow">
            <p v-if="!racket.tags || racket.tags.length === 0" class="text-sm text-gray-400">태그 정보가 없습니다.</p>
            <template v-else>
                <span v-for="tag in displayedTags" :key="tag.id" class="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                    #{{ tag.name }}
                </span>
                <span v-if="remainingTagsCount > 0" class="bg-gray-200 text-gray-700 text-sm font-semibold px-2.5 py-1 rounded-full">
                    +{{ remainingTagsCount }}
                </span>
            </template>
        </div>
    </div>

    <!-- Rating Popover -->
    <div v-if="showRatingPopover" class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl p-4 z-10" @click.self="toggleRatingPopover">
      <div class="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-full max-w-xs">
        <h4 class="font-bold text-gray-800 mb-3 text-center leading-tight">"{{ racket.name }}"<br>별점을 남겨주세요</h4>
        <StarRating 
          :initial-rating="userRating || 0"
          @update:rating="handleRatingUpdate"
          class="justify-center"
        />
        <p v-if="isLoading" class="text-center text-sm text-blue-500 mt-3">저장 중...</p>
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