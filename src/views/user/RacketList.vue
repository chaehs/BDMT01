<template>
  <div class="w-full">
    <!-- Filter Section -->
    <div class="mb-12 max-w-4xl mx-auto space-y-6">
      <div class="flex flex-wrap justify-center gap-4">
        <!-- Brand Filter -->
        <select v-model="filters.brand" class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600">
          <option value="">브랜드 전체</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>

        <!-- Weight Filter -->
        <select v-model="filters.weight" class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600">
          <option value="">무게 전체</option>
          <option v-for="w in weights" :key="w" :value="w">{{ w }}</option>
        </select>

        <!-- Balance Filter -->
        <select v-model="filters.balance" class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600">
          <option value="">밸런스 전체</option>
          <option v-for="b in balances" :key="b" :value="b">{{ b }}</option>
        </select>

        <!-- Flex Filter -->
        <select v-model="filters.flex" class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600">
          <option value="">탄성 전체</option>
          <option v-for="f in flexes" :key="f" :value="f">{{ f }}</option>
        </select>

        <!-- Search Input -->
        <div class="relative flex-1 min-w-[200px]">
          <input 
            v-model="filters.search"
            type="text" 
            placeholder="라켓 명칭 검색..." 
            class="w-full pl-10 pr-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-medium"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        <!-- Reset Button -->
        <button @click="resetFilters" class="px-4 py-2 bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors">
          초기화
        </button>
      </div>
      
      <!-- Popular Tags for Search -->
      <div class="flex flex-wrap justify-center gap-2">
        <button 
          v-for="tag in popularTags" 
          :key="tag"
          @click="toggleTag(tag)"
          :class="[
            'text-xs font-bold px-3 py-1.5 rounded-full transition-all shadow-sm border',
            filters.tags.includes(tag) 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50'
          ]"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <!-- Racket Display Area -->
    <div class="mt-12">
      <!-- 1. Initial State -->
      <div v-if="!hasSearched" class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
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
            @open-detail="openDetail"
          />
        </div>
      </div>

      <!-- 4. No Results State -->
      <div v-else class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <span class="text-4xl block mb-4">🤔</span>
        <p class="text-gray-600 font-bold text-lg">검색 결과가 없습니다.</p>
        <p class="text-gray-500 font-medium mt-1">다른 필터나 검색어를 시도해보세요.</p>
      </div>
    </div>

    <!-- Detail Modal -->
    <RacketDetail 
      :is-open="isDetailOpen" 
      :racket="selectedRacket" 
      @close="closeDetail" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import RacketCard from '../../components/RacketCard.vue'
import RacketDetail from './RacketDetail.vue'
import { supabase } from '../../supabase'

const brands = ['YONEX', 'VICTOR', 'LI-NING', 'MIZUNO']
const weights = ['3U', '4U', '5U', 'F']
const balances = ['HEAD LIGHT', 'EVEN BALANCE', 'HEAD HEAVY']
const flexes = ['FLEXIBLE', 'MEDIUM', 'STIFF', 'EXTRA STIFF']
const popularTags = ['초보자용', '소리좋음', '잘깨짐', '가성비', '공격형', '수비형']

const filters = reactive({
  brand: '',
  weight: '',
  balance: '',
  flex: '',
  search: '',
  tags: []
})

const rackets = ref([])
const isLoading = ref(false)
const hasSearched = ref(false)

const isDetailOpen = ref(false)
const selectedRacket = ref(null)

const openDetail = (racket) => {
  selectedRacket.value = racket
  isDetailOpen.value = true
}

const closeDetail = () => {
  isDetailOpen.value = false
  selectedRacket.value = null
}

const fetchRackets = async () => {
  const isFilterActive = filters.brand || filters.weight || filters.balance || filters.flex || filters.search.trim() || filters.tags.length > 0;

  if (!isFilterActive) {
    rackets.value = [];
    hasSearched.value = false;
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  hasSearched.value = true;

  try {
    let query = supabase.from('rackets').select('*');

    if (filters.brand) {
      query = query.eq('brand', filters.brand);
    }
    if (filters.weight) {
      query = query.eq('weight', filters.weight);
    }
    if (filters.balance) {
      query = query.eq('balance', filters.balance);
    }
    if (filters.flex) {
      query = query.eq('flex', filters.flex);
    }
    if (filters.search.trim()) {
      query = query.ilike('name', `%${filters.search.trim()}%`);
    }
    if (filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    const { data, error } = await query.limit(20);

    if (error) throw error;
    rackets.value = data;

  } catch (error) {
    console.error('Error fetching rackets:', error.message);
    rackets.value = [];
  } finally {
    isLoading.value = false;
  }
};

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

watch(filters, debounce(fetchRackets, 300), {
  deep: true,
});

const resetFilters = () => {
  filters.brand = ''
  filters.weight = ''
  filters.balance = ''
  filters.flex = ''
  filters.search = ''
  filters.tags = []
}

const toggleTag = (tag) => {
  const index = filters.tags.indexOf(tag)
  if (index > -1) {
    filters.tags.splice(index, 1)
  } else {
    filters.tags.push(tag)
  }
}
</script>
