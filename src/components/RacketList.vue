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
        <span class="text-4xl block mb-4">😅</span>
        <p class="text-gray-500 font-medium">검색 결과가 없습니다.</p>
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
import { ref, computed, reactive } from 'vue'
import RacketCard from './RacketCard.vue'
import RacketDetail from './RacketDetail.vue'

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

const isAnyFilterActive = computed(() => {
  return filters.brand !== '' || filters.weight !== '' || filters.search !== '' || filters.tags.length > 0
})

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

const rackets = ref([
  { 
    id: 1, 
    name: 'ArcSaber 11 Pro', 
    brand: 'Yonex', 
    imageUrl: 'https://placehold.co/400x500/slate/white?text=ArcSaber+11', 
    weight: '4U', 
    balance: 'Even Balance', 
    shaftFlex: 'Stiff', 
    maxTension: '28 lbs', 
    gripSize: 'G5',
    frameShape: 'Isometric',
    colors: ['#FF0000', '#000000'],
    rating: 4.7,
    reviewCount: 26,
    tags: ['가성비', '올라운드', '명검', '정교함', '초보자용', '소리좋음'] 
  },
  { 
    id: 2, 
    name: 'Astrox 99 Pro', 
    brand: 'Yonex', 
    imageUrl: 'https://placehold.co/400x500/orange/white?text=Astrox+99', 
    weight: '3U', 
    balance: 'Head Heavy', 
    shaftFlex: 'Extra Stiff', 
    maxTension: '29 lbs', 
    gripSize: 'G5',
    frameShape: 'Isometric',
    colors: ['#FF8C00', '#000000'],
    rating: 4.8,
    reviewCount: 42,
    tags: ['파워', '스매시', '공격형', '국가대표', '상급자용'] 
  },
  { 
    id: 3, 
    name: 'Brave Sword 12', 
    brand: 'Victor', 
    imageUrl: 'https://placehold.co/400x500/blue/white?text=BS+12', 
    weight: '4U', 
    balance: 'Even Balance', 
    shaftFlex: 'Medium', 
    maxTension: '30 lbs', 
    gripSize: 'G5',
    frameShape: 'Aero-Sword',
    colors: ['#0000FF', '#FFFFFF'],
    rating: 4.5,
    reviewCount: 158,
    tags: ['스피드', '드라이브', '가성비', '입문추천', '초보자용'] 
  }
])

const filteredRackets = computed(() => {
  return rackets.value.filter(racket => {
    const brandMatch = !filters.brand || racket.brand === filters.brand
    const weightMatch = !filters.weight || racket.weight === filters.weight
    const searchMatch = !filters.search || 
      racket.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      racket.brand.toLowerCase().includes(filters.search.toLowerCase())
    const tagMatch = filters.tags.length === 0 || 
      filters.tags.every(t => racket.tags.includes(t))

    return brandMatch && weightMatch && searchMatch && tagMatch
  })
})
</script>