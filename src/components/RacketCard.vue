<template>
  <router-link :to="'/racket/' + racket.id" class="group block bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
    <div class="relative overflow-hidden rounded-t-3xl pt-[100%]">
      <img :src="imageUrl" :alt="racket.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      <div class="absolute top-4 right-4 bg-gray-900/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">{{ racket.brand }}</div>
    </div>
    <div class="p-5">
      <h3 class="font-black text-gray-900 text-lg truncate">{{ racket.name }}</h3>
      <div class="mt-2 flex items-center justify-between text-gray-500">
        <p class="text-sm font-bold"><span class="text-gray-400">무게:</span> {{ racket.weight || 'N/A' }}</p>
        <div class="flex items-center gap-1">
          <span class="text-yellow-400">★</span>
          <span class="font-bold text-gray-800 text-sm">{{ racket.rating || 0 }}</span>
        </div>
      </div>
    </div>
  </router-link>
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
</script>
