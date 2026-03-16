<template>
  <div class="group block bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <!-- Top Section: Image + Specs -->
    <div class="flex gap-5">
      <!-- Left: Image -->
      <div class="w-1/3 flex-shrink-0">
        <div class="relative overflow-hidden rounded-lg pt-[100%]">
          <img :src="imageUrl" :alt="racket.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
        </div>
      </div>

      <!-- Right: Specs -->
      <div class="w-2/3">
        <div class="bg-gray-800 text-white text-sm font-bold px-2.5 py-1 rounded-full inline-block mb-2">{{ uppercasedBrand }}</div>
        <h3 class="font-bold text-gray-900 text-lg leading-tight truncate-2-lines">{{ racket.name }}</h3>
        
        <div class="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-sm font-medium text-gray-700">
          <p><span class="font-semibold text-gray-500">무게:</span> {{ uppercasedWeight }}</p>
          <p><span class="font-semibold text-gray-500">탄성:</span> {{ uppercasedFlex }}</p>
          <p><span class="font-semibold text-gray-500">최대장력:</span> {{ racket.max_tension || '' }}</p>
          <p><span class="font-semibold text-gray-500">그립:</span> {{ racket.grip_size || '' }}</p>
          <p><span class="font-semibold text-gray-500">밸런스:</span> {{ racket.balance || '' }}</p>
          <p><span class="font-semibold text-gray-500">B.P:</span> {{ racket.bal_point ? racket.bal_point + 'mm' : '' }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Rating + Tags -->
    <div class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
        <div class="flex-shrink-0 flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
            <span class="text-yellow-400">★</span>
            <span class="font-bold text-gray-800 text-sm">{{ racket.rating || 0 }}</span>
        </div>
        <div class="flex flex-wrap gap-1.5 flex-grow">
            <p v-if="!racket.tags || racket.tags.length === 0" class="text-sm text-gray-400">태그 정보가 없습니다.</p>
            <template v-else>
                <span v-for="tag in displayedTags" :key="tag" class="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                    #{{ tag }}
                </span>
                <span v-if="remainingTagsCount > 0" class="bg-gray-200 text-gray-700 text-sm font-semibold px-2.5 py-1 rounded-full">
                    +{{ remainingTagsCount }}
                </span>
            </template>
        </div>
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
})

// --- Computed Properties for Display ---

const uppercasedBrand = computed(() => {
  return props.racket.brand ? props.racket.brand.toUpperCase() : '';
});

const uppercasedWeight = computed(() => {
  if (!props.racket.weight) return '';
  return String(props.racket.weight).toUpperCase();
});

const uppercasedFlex = computed(() => {
  if (!props.racket.flex) return '';
  return String(props.racket.flex).toUpperCase();
});

// --- Image URL Logic ---

const BUCKET_NAME = 'BDMT01';
const IMAGE_FOLDER = 'racket_storage';

const imageUrl = computed(() => {
  if (!props.racket.image_url) {
    return `https://placehold.co/300x300/F3F4F6/9CA3AF?text=${props.racket.name}`
  }
  if (props.racket.image_url.startsWith('http')) {
    return props.racket.image_url
  }
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${IMAGE_FOLDER}/${props.racket.image_url}`);
    
  return data.publicUrl;
});

// --- Tag Display Logic ---
const displayedTags = computed(() => {
    if (!props.racket.tags || props.racket.tags.length === 0) {
        return [];
    }
    return props.racket.tags.slice(0, 3); // Show 3 tags
});

const remainingTagsCount = computed(() => {
    if (!props.racket.tags || props.racket.tags.length <= 3) {
        return 0;
    }
    return props.racket.tags.length - 3;
});

</script>

<style scoped>
.truncate-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
}
</style>
