<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
    <div class="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors z-10">
        ✕
      </button>

      <div class="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
        <!-- Left: Image & Quick Stats -->
        <div class="w-full md:w-1/2 p-8 bg-slate-50 flex flex-col items-center border-r border-slate-100">
          <div class="w-full aspect-square rounded-3xl bg-white shadow-xl border border-slate-200 p-6 mb-6 flex items-center justify-center">
            <img :src="racket.imageUrl" class="w-full h-full object-contain drop-shadow-2xl" :alt="racket.name" />
          </div>
          
          <div class="w-full space-y-4">
            <h2 class="text-3xl font-black text-slate-900 leading-tight">{{ racket.name }}</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in racket.tags" :key="tag" class="px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Detailed Specs & Ratings -->
        <div class="w-full md:w-1/2 p-8 space-y-8">
          <!-- Rating Section -->
          <section>
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">평점 및 분포</h4>
            <div class="flex items-center gap-6 mb-6">
              <div class="text-center">
                <div class="text-5xl font-black text-slate-900">{{ racket.rating }}</div>
                <div class="text-yellow-400 text-xl mt-1">★★★★★</div>
                <div class="text-[10px] text-slate-400 font-bold mt-1">총 {{ racket.reviewCount }}명 참여</div>
              </div>
              
              <!-- Bar Graph -->
              <div class="flex-1 space-y-1.5">
                <div v-for="i in 5" :key="i" class="flex items-center gap-2">
                  <span class="text-[10px] font-bold text-slate-400 w-3">{{ 6-i }}</span>
                  <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-400 rounded-full" :style="{ width: getRatingPercent(6-i) + '%' }"></div>
                  </div>
                  <span class="text-[10px] font-bold text-slate-300 w-6 text-right">{{ getRatingPercent(6-i) }}%</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Full Specs Section -->
          <section>
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">상세 스펙</h4>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="spec in fullSpecs" :key="spec.label" class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div class="text-[10px] text-slate-400 font-bold mb-0.5">{{ spec.label }}</div>
                <div class="text-sm font-black text-slate-800">{{ spec.value }}</div>
              </div>
            </div>
          </section>

          <!-- Tag Input Placeholder -->
          <section>
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">태그 추가</h4>
            <div class="relative">
              <input type="text" placeholder="새로운 태그를 입력하세요 (최대 6자)" class="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none text-sm transition-all" />
              <button class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-slate-900 text-white text-[11px] font-black rounded-xl">등록</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  racket: Object
})

defineEmits(['close'])

const fullSpecs = computed(() => {
  if (!props.racket) return []
  return [
    { label: '브랜드', value: props.racket.brand },
    { label: '무게', value: props.racket.weight },
    { label: '밸런스', value: props.racket.balance },
    { label: '탄성', value: props.racket.shaftFlex },
    { label: '최대장력', value: props.racket.maxTension },
    { label: '그립두께', value: props.racket.gripSize },
    { label: '프레임', value: props.racket.frameShape },
    { label: '대표색상', value: props.racket.colors.join(', ') }
  ]
})

const getRatingPercent = (star) => {
  // Mock distribution
  const distributions = {
    5: 65,
    4: 20,
    3: 10,
    2: 3,
    1: 2
  }
  return distributions[star] || 0
}
</script>