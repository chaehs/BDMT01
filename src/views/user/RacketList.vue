<template>
  <div class="w-full">
    <!-- Filter Section -->
    <RacketFilter 
      v-model="filters"
      @reset="resetFilters"
      @toggle-tag="toggleTag"
    />

    <!-- Racket Display Area -->
    <div class="mt-12">
      <!-- 1. Initial State -->
      <div v-if="!hasActiveFilters" class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <span class="text-5xl block mb-4">🏸</span>
        <h2 class="text-2xl font-bold text-gray-800">라켓을 찾아보세요!</h2>
        <p class="text-gray-500 font-medium mt-2">상단의 필터를 사용하거나 검색하여 원하는 라켓을 찾을 수 있습니다.</p>
      </div>

      <!-- 2. Loading State -->
      <div v-else-if="racketStore.isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
        <p class="text-gray-500 font-medium mt-4">데이터를 불러오는 중입니다...</p>
      </div>

      <!-- 3. Racket Grid -->
      <div v-else-if="filteredRackets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-10 lg:gap-x-16">
        <div v-for="racket in filteredRackets" :key="racket.id" class="flex justify-center">
          <RacketCard 
            :racket="racket" 
            class="w-full" 
          />
        </div>
      </div>

      <!-- 4. No Results State -->
      <div v-else class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <span class="text-4xl block mb-4">🤔</span>
        <p class="text-gray-600 font-bold text-lg">라켓을 찾을 수 없습니다.</p>
        <p class="text-gray-500 font-medium mt-1">다른 필터나 검색어를 시도해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import RacketCard from '../../components/RacketCard.vue'
import RacketFilter from '../../components/RacketFilter.vue'
import { useRacketStore } from '../../stores/racket'

const racketStore = useRacketStore()

const filters = ref({
  brand: '',
  weight: '',
  balance: '',
  flex: '',
  search: '',
  tags: []
})

// 모든 필터링을 통과한 라켓 목록을 계산합니다.
const filteredRackets = computed(() => {
  const selectedTags = filters.value.tags;
  if (!selectedTags || selectedTags.length === 0) {
    return racketStore.rackets;
  }
  
  return racketStore.rackets.filter(racket => {
    if (!racket.tags || racket.tags.length === 0) return false;
    const racketTagNames = racket.tags.map(t => t.name);
    return selectedTags.every(selectedTag => racketTagNames.includes(selectedTag));
  });
});

const hasActiveFilters = computed(() => {
  return filters.value.brand || 
         filters.value.weight || 
         filters.value.balance || 
         filters.value.flex || 
         (filters.value.search && filters.value.search.trim()) ||
         (filters.value.tags && filters.value.tags.length > 0);
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
    racketStore.fetchRackets(newFilters);
}, 300);

watch(filters, (newFilters, oldFilters) => {
    const nonTagFiltersChanged = (
      newFilters.brand !== oldFilters.brand ||
      newFilters.weight !== oldFilters.weight ||
      newFilters.balance !== oldFilters.balance ||
      newFilters.flex !== oldFilters.flex ||
      newFilters.search !== oldFilters.search
    );

    if (hasActiveFilters.value) {
      // 1. 태그 외 다른 필터가 변경되었거나
      // 2. 현재 라켓 데이터가 없는 상태에서 필터가 활성화된 경우 (최초 태그 클릭 포함)
      if (nonTagFiltersChanged || racketStore.rackets.length === 0) {
        debouncedFetch(newFilters);
      }
    } else {
      // 필터가 모두 비워지면 데이터도 비웁니다.
      racketStore.rackets = [];
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
  if (!filters.value.tags) filters.value.tags = [];
  const index = filters.value.tags.indexOf(tag)
  if (index > -1) {
    filters.value.tags.splice(index, 1)
  } else {
    filters.value.tags.push(tag)
  }
}
</script>
