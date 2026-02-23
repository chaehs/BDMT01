
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

    <!-- Racket Grid -->
    <div>
      <div v-if="filteredRackets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-10 lg:gap-x-16">
        <div v-for="racket in filteredRackets" :key="racket.id" class="flex justify-center">
          <RacketCard 
            :racket="racket" 
            class="w-full" 
            @open-detail="openDetail"
          />
        </div>
      </div>

      <!-- No results state -->
      <div v-else class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <span class="text-4xl block mb-4">🤔</span>
        <p class="text-gray-500 font-medium">데이터를 불러오는 중이거나, 표시할 라켓이 없습니다.</p>
        <p class="text-xs text-gray-400 mt-2">잠시만 기다려주세요...</p>
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
import { ref, computed, reactive, onMounted } from 'vue'
import RacketCard from './RacketCard.vue'
import RacketDetail from './RacketDetail.vue'
import { supabase } from '../supabase'

const brands = ['Yonex', 'Victor', 'Li-Ning', 'Mizuno']
const weights = ['3U', '4U', '5U', 'F']
const popularTags = ['초보자용', '소리좋음', '잘깨짐', '가성비', '공격형', '수비형']

const filters = reactive({
  brand: '',
  weight: '',
  search: '',
  tags: []
})

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

const resetFilters = () => {
  filters.brand = ''
  filters.weight = ''
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

const rackets = ref([])

onMounted(async () => {
  console.log('Fetching rackets from Supabase...');
  const { data, error } = await supabase.from('rackets').select('*');

  if (error) {
    console.error('Error fetching rackets:', error);
  } else if (data) {
    console.log('Fetched data:', data);
    rackets.value = data;
  } else {
    console.log('No data returned from Supabase. This might be due to Row Level Security (RLS).');
  }
});

const filteredRackets = computed(() => {
    if (!rackets.value) return [];
    return rackets.value.filter(racket => {
        const brandMatch = !filters.brand || racket.brand === filters.brand;
        const weightMatch = !filters.weight || racket.weight === filters.weight;
        const searchMatch = !filters.search || 
            (racket.name && racket.name.toLowerCase().includes(filters.search.toLowerCase())) ||
            (racket.brand && racket.brand.toLowerCase().includes(filters.search.toLowerCase()));
        const tagMatch = filters.tags.length === 0 || 
            (racket.tags && filters.tags.every(t => racket.tags.includes(t)));

        return brandMatch && weightMatch && searchMatch && tagMatch;
    });
});
</script>
