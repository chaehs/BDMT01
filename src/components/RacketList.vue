<template>
  <div class="w-full">
    <!-- Search & Filter Section -->
    <div class="mb-12 max-w-2xl mx-auto">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span class="text-gray-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="라켓 이름 또는 브랜드를 검색하세요..." 
          class="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-3xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-gray-700 font-medium placeholder:text-gray-300"
        />
      </div>
      
      <!-- Popular Tags for Search -->
      <div class="mt-4 flex flex-wrap justify-center gap-2">
        <span class="text-xs font-bold text-gray-400 mr-2 py-1">인기 검색어:</span>
        <button 
          v-for="tag in popularTags" 
          :key="tag"
          @click="searchQuery = tag"
          class="text-xs font-bold px-3 py-1 rounded-full bg-white border border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <!-- Grid container with explicit columns and gaps -->
    <div v-if="filteredRackets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-10 lg:gap-x-16">
      <div v-for="racket in filteredRackets" :key="racket.id" class="flex justify-center">
        <RacketCard :racket="racket" class="w-full" />
      </div>
    </div>

    <!-- No results state -->
    <div v-else class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
      <span class="text-4xl block mb-4">😅</span>
      <p class="text-gray-500 font-medium">검색 결과가 없습니다. 다른 검색어를 입력해보세요.</p>
      <button @click="searchQuery = ''" class="mt-4 text-blue-600 font-bold hover:underline">검색 초기화</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RacketCard from './RacketCard.vue'

const searchQuery = ref('')
const popularTags = ['공격형', '수비형', '올라운드', '가성비', '초보자']

const rackets = ref([
  { 
    id: 1, 
    name: 'ArcSaber 11 Pro', 
    brand: 'Yonex', 
    imageUrl: 'https://placehold.co/400x500/slate/white?text=ArcSaber+11', 
    weight: '3U/4U', 
    balance: 'Even Balance', 
    shaftFlex: 'Stiff', 
    maxTension: '28 lbs', 
    gripSize: 'G5', 
    colors: ['#FF0000', '#000000'],
    tags: ['컨트롤', '올라운드', '명검', '정교함'] 
  },
  { 
    id: 2, 
    name: 'Astrox 99 Pro', 
    brand: 'Yonex', 
    imageUrl: 'https://placehold.co/400x500/orange/white?text=Astrox+99', 
    weight: '3U/4U', 
    balance: 'Head Heavy', 
    shaftFlex: 'Extra Stiff', 
    maxTension: '29 lbs', 
    gripSize: 'G5', 
    colors: ['#FF8C00', '#000000'],
    tags: ['파워', '스매시', '공격형', '국가대표'] 
  },
  { 
    id: 3, 
    name: 'Brave Sword 12', 
    brand: 'Victor', 
    imageUrl: 'https://placehold.co/400x500/blue/white?text=BS+12', 
    weight: '3U/4U', 
    balance: 'Even Balance', 
    shaftFlex: 'Medium', 
    maxTension: '30 lbs', 
    gripSize: 'G5', 
    colors: ['#0000FF', '#FFFFFF'],
    tags: ['스피드', '드라이브', '가성비', '입문추천'] 
  },
  { 
    id: 4, 
    name: 'Thruster F', 
    brand: 'Victor', 
    imageUrl: 'https://placehold.co/400x500/black/white?text=Thruster+F', 
    weight: '4U', 
    balance: 'Head Heavy', 
    shaftFlex: 'Stiff', 
    maxTension: '31 lbs', 
    gripSize: 'G5', 
    colors: ['#000000', '#FFD700'],
    tags: ['파워', '공격형', '안정감'] 
  }
])

const filteredRackets = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return rackets.value

  return rackets.value.filter(racket => {
    return (
      racket.name.toLowerCase().includes(query) ||
      racket.brand.toLowerCase().includes(query) ||
      racket.tags.some(tag => tag.toLowerCase().includes(query))
    )
  })
})
</script>