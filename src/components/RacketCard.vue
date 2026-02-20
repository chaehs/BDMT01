<template>
  <div class="racket-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex items-center h-full">
    <!-- Racket Image (Left) -->
    <div class="w-8 h-8 flex-shrink-0 mx-4 flex items-center justify-center">
         <img :src="racket.imageUrl" :alt="racket.name" class="max-w-full max-h-full object-contain">
    </div>

    <!-- Content Section (Right) -->
    <div class="flex flex-col flex-grow border-l border-gray-200">
        <!-- Main Info (Specs, etc.) -->
        <div class="py-3 pl-4 pr-6 flex-grow flex flex-col justify-center">
            <!-- Header -->
            <div class="mb-2">
              <h3 class="text-md font-bold text-gray-900">{{ racket.name }}</h3>
              <p class="text-sm text-gray-500">{{ racket.brand }}</p>
            </div>

            <!-- Specs -->
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
              <div class="flex justify-between">
                <span class="font-semibold">Weight:</span>
                <span>{{ racket.weight }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Balance:</span>
                <span>{{ racket.balance }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Flex:</span>
                <span>{{ racket.shaftFlex }}</span>
              </div>
               <div class="flex justify-between">
                <span class="font-semibold">Max Tension:</span>
                <span>{{ racket.maxTension }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Grip Size:</span>
                <span>{{ racket.gripSize }}</span>
              </div>
            </div>
        </div>

        <!-- Keyword/Tags Section -->
        <div class="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div class="flex flex-wrap gap-1.5 items-center">
                <h4 class="text-xs font-semibold text-gray-500 uppercase mr-2">Keywords</h4>
                <span v-for="tag in racket.tags" :key="tag"
                    class="px-2 py-0.5 text-xs font-semibold rounded-full"
                    :class="getTagClass(tag)">
                    {{ tag }}
                </span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  racket: {
    type: Object,
    required: true,
  },
});

const getTagClass = (tag) => {
  const tagColors = {
    'Control': 'bg-blue-100 text-blue-800',
    'Power': 'bg-red-100 text-red-800',
    'Speed': 'bg-green-100 text-green-800',
    'All-around': 'bg-purple-100 text-purple-800'
  };
  return tagColors[tag] || 'bg-gray-200 text-gray-800';
};
</script>

<style scoped>
.racket-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.racket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
