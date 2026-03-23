<script setup>
import { onMounted, ref } from 'vue'
import RacketCard from '../components/RacketCard.vue'
import FilterControls from '../components/FilterControls.vue'
import { useRacketStore } from '../stores/racket'
import { storeToRefs } from 'pinia'

const racketStore = useRacketStore()
const { rackets, isLoading } = storeToRefs(racketStore)

const filters = ref({})
function applyFilters(newFilters) {
  filters.value = newFilters
  racketStore.fetchRackets(filters.value) 
}

onMounted(() => {
  racketStore.fetchRackets()
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-8 text-center">
        🏸 배드민턴 라켓 파인더
      </h1>
      
      <FilterControls @apply="applyFilters" />

      <div v-if="isLoading" class="text-center py-10">
        <p class="text-lg text-gray-500">🚀 데이터를 불러오는 중...</p>
        <div class="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
      </div>
      
      <div v-else-if="rackets.length > 0" class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <RacketCard 
          v-for="racket in rackets" 
          :key="racket.id"
          :racket="racket"
        />
      </div>
      
      <div v-else class="mt-6 text-center py-10 bg-gray-100 rounded-lg">
        <p class="text-lg text-gray-500">🤔 표시할 라켓 정보가 없습니다.</p>
        <p class="text-gray-400 mt-2">필터 조건을 변경하거나 새로운 라켓을 추가해 보세요.</p>
      </div>
    </div>
  </div>
</template>
