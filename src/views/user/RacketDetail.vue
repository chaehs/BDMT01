<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
      <p class="text-gray-500 font-medium mt-4">라켓 정보를 불러오는 중입니다...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-red-100">
      <span class="text-5xl block mb-4">⚠️</span>
      <h2 class="text-2xl font-bold text-gray-800">정보를 불러올 수 없습니다.</h2>
      <p class="text-gray-500 mt-2">{{ error }}</p>
      <button @click="goBack" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
        목록으로 돌아가기
      </button>
    </div>

    <!-- Main Content -->
    <div v-else-if="racket" class="max-w-5xl mx-auto">
      <!-- Back Button -->
      <button @click="goBack" class="mb-6 flex items-center text-gray-500 hover:text-blue-600 font-bold transition-colors">
        <span class="mr-2">←</span> 목록으로 돌아가기
      </button>

      <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Main Content Layout -->
        <div class="flex flex-col md:flex-row gap-8 p-8 md:p-12">
          
          <!-- Left Column: Image & Main Info -->
          <div class="w-full md:w-1/3 flex flex-col items-center">
            <div class="w-full aspect-[3/4] bg-gray-50 rounded-2xl shadow-inner border border-gray-100 p-6 mb-8 flex items-center justify-center">
              <img :src="racketImageUrl" @error="handleImageError" :alt="racket.name" class="w-full h-full object-contain drop-shadow-2xl scale-110">
            </div>
            <h1 class="text-4xl font-black text-gray-900 text-center leading-tight tracking-tight">{{ racket.name }}</h1>
            <p class="text-xl font-bold text-gray-400 mt-1 uppercase">{{ racket.brand }}</p>
            <div class="flex items-center mt-5 bg-yellow-400 text-white px-5 py-2.5 rounded-2xl shadow-lg border border-yellow-500/20">
              <span class="text-xl mr-1.5">★</span>
              <span class="font-black text-2xl">{{ racket.rating || 0 }}</span>
              <span class="text-sm ml-2 font-bold opacity-80">({{ racket.review_count || 0 }} reviews)</span>
            </div>
          </div>

          <!-- Right Column: Details & Ratings -->
          <div class="w-full md:w-2/3 space-y-8">
            
            <!-- Main Specifications -->
            <div class="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 class="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-6">Specifications</h2>
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div v-for="spec in specs" :key="spec.label" class="group">
                  <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 group-hover:text-blue-400 transition-colors">{{ spec.label }}</p>
                  <p class="text-lg font-black text-gray-800">{{ spec.value }}</p>
                </div>
              </div>
            </div>

            <!-- Rating Distribution -->
            <div class="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 class="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-6">Rating Distribution</h2>
              <div class="space-y-4">
                <div v-for="dist in sortedDistribution" :key="dist.stars" class="flex items-center gap-4">
                  <span class="text-xs font-black text-gray-400 w-12">{{ dist.stars }} stars</span>
                  <div class="flex-1 bg-white rounded-full h-3 overflow-hidden border border-gray-100 shadow-sm">
                    <div class="bg-gradient-to-r from-yellow-300 to-yellow-400 h-full rounded-full transition-all duration-1000" :style="{ width: getRatingPercentage(dist.count) + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold text-gray-500 w-8 text-right">{{ dist.count }}</span>
                </div>
              </div>
            </div>

            <!-- User Tags -->
            <div class="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 class="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-6">Popular User Tags</h2>
              <div class="flex flex-wrap gap-2.5">
                <span v-for="tag in racket.tags" :key="tag" 
                      class="bg-white text-gray-600 text-xs font-black px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:text-blue-600 transition-all cursor-default">
                  #{{ tag }}
                </span>
                <span v-if="!racket.tags || racket.tags.length === 0" class="text-sm text-gray-400 italic font-medium">
                  첫 번째 태그를 등록해보세요.
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../supabase'

const route = useRoute()
const router = useRouter()

const racket = ref(null)
const isLoading = ref(true)
const error = ref(null)

const fetchRacketDetail = async () => {
  const id = route.params.id
  if (!id) {
    error.value = "유효하지 않은 접근입니다."
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    const { data, error: supabaseError } = await supabase
      .from('rackets')
      .select('*')
      .eq('id', id)
      .single()

    if (supabaseError) throw supabaseError
    if (!data) throw new Error("라켓 정보를 찾을 수 없습니다.")

    racket.value = data
  } catch (err) {
    console.error('Error fetching racket:', err.message)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRacketDetail()
})

const goBack = () => {
  router.push('/')
}

const racketImageUrl = computed(() => {
  if (!racket.value || !racket.value.image_url) return defaultImageUrl.value
  const path = racket.value.image_url
  
  if (path.startsWith('http')) return path

  const { data } = supabase.storage
    .from('BDMT01')
    .getPublicUrl(`RACKETS/${path}`)
  
  return data.publicUrl
})

const defaultImageUrl = computed(() => {
  const { data } = supabase.storage
    .from('BDMT01')
    .getPublicUrl('RACKETS/DEFAULT_RACKET.png')
  return `${data.publicUrl}?t=${new Date().getTime()}`
})

const handleImageError = (e) => {
  const baseDefaultPath = 'RACKETS/DEFAULT_RACKET.png'
  if (!e.target.src.includes(baseDefaultPath)) {
    e.target.src = defaultImageUrl.value
  } else {
    e.target.src = 'https://placehold.co/400x600?text=No+Image'
  }
}

const totalReviews = computed(() => {
  if (!racket.value || !racket.value.rating_distribution) return 1
  return racket.value.rating_distribution.reduce((acc, dist) => acc + dist.count, 0) || 1
})

const getRatingPercentage = (count) => {
  return (count / totalReviews.value) * 100
}

const sortedDistribution = computed(() => {
  if (!racket.value || !racket.value.rating_distribution) return []
  return [...racket.value.rating_distribution].sort((a, b) => b.stars - a.stars)
})

const specs = computed(() => [
  { label: 'Brand', value: racket.value?.brand || '-' },
  { label: 'Weight', value: racket.value?.weight || '-' },
  { label: 'Balance', value: racket.value?.balance || '-' },
  { label: 'Flex', value: racket.value?.flex || '-' },
  { label: 'Max Tension', value: racket.value?.max_tension || '-' },
  { label: 'Grip Size', value: racket.value?.grip_size || '-' }
])
</script>
