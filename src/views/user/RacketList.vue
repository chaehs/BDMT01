<template>
  <div class="w-full">
    <!-- Filter Section (Extracted to Component) -->
    <RacketFilter 
      v-model="filters"
      @reset="resetFilters"
      @toggle-tag="toggleTag"
    />

    <!-- Racket Display Area -->
    <div class="mt-12">
      <!-- 1. Initial State -->
      <div v-if="!hasSearched && !isLoading" class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <span class="text-5xl block mb-4">🏸</span>
        <h2 class="text-2xl font-bold text-gray-800">라켓을 찾아보세요!</h2>
        <p class="text-gray-500 font-medium mt-2">상단의 필터를 사용하거나 검색하여 원하는 라켓을 찾을 수 있습니다.</p>
      </div>

      <!-- 2. Loading State -->
      <div v-else-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
        <p class="text-gray-500 font-medium mt-4">데이터를 불러오는 중입니다...</p>
      </div>

      <!-- 3. Racket Grid (Results Found) -->
      <div v-else-if="rackets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-10 lg:gap-x-16">
        <div v-for="racket in rackets" :key="racket.id" class="flex justify-center">
          <RacketCard 
            :racket="racket" 
            class="w-full" 
          />
        </div>
      </div>

      <!-- 4. No Results State -->
      <div v-else-if="hasSearched && !isLoading" class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <span class="text-4xl block mb-4">🤔</span>
        <p class="text-gray-600 font-bold text-lg">검색 결과가 없습니다.</p>
        <p class="text-gray-500 font-medium mt-1">다른 필터나 검색어를 시도해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject, computed } from 'vue'
import RacketCard from '../../components/RacketCard.vue'
import RacketFilter from '../../components/RacketFilter.vue'

const { rackets, isLoading, fetchRackets } = inject('rackets')

const filters = ref({
  brand: '',
  weight: '',
  balance: '',
  flex: '',
  search: '',
  tags: []
})

const hasSearched = computed(() => {
  return filters.value.brand || filters.value.weight || filters.value.balance || filters.value.flex || filters.value.search.trim() || filters.value.tags.length > 0;
})

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const debouncedFetch = debounce((newFilters) => {
    fetchRackets(newFilters);
}, 300);

watch(filters, (newFilters) => {
    // 필터 값이 하나라도 있는지 확인
    if (newFilters.brand || newFilters.weight || newFilters.balance || newFilters.flex || newFilters.search.trim() || newFilters.tags.length > 0) {
        isLoading.value = true; // 데이터를 기다리는 동안 로딩 상태로 즉시 변경
        debouncedFetch(newFilters);
    } else {
        // 모든 필터가 비어있으면, 라켓 목록을 비우고 로딩 상태를 해제
        rackets.value = [];
        if(isLoading.value) {
            isLoading.value = false;
        }
    }
}, { deep: true });

const resetFilters = () => {
  filters.value = {
    brand: '',
    weight: '',
    balance: '',
    flex: '',
    search: '',
    tags: []
  }
}

const toggleTag = (tag) => {
  const index = filters.value.tags.indexOf(tag)
  if (index > -1) {
    filters.value.tags.splice(index, 1)
  } else {
    filters.value.tags.push(tag)
  }
}
</script>
