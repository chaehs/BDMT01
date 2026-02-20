<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 flex flex-col h-full hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
    <!-- Subtle background texture effect -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

    <!-- Header Area -->
    <div class="mb-3 relative z-10">
      <div class="flex justify-between items-start">
        <div>
          <span class="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1 border border-blue-100">
            {{ racket.brand }}
          </span>
          <h3 class="text-xl font-black text-gray-900 Glass leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
            {{ racket.name }}
          </h3>
        </div>
        <!-- Status Indicator / Rank? (Optional placeholder) -->
        <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
          <span class="text-[10px] font-bold text-gray-400">#{{ racket.id }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area: Image (Left) & Specs (Right) -->
    <div class="flex gap-5 mb-4 relative z-10 flex-1 min-h-0">
      <!-- Image Area -->
      <div class="w-1/3 aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center p-2 relative group-hover:scale-[1.02] transition-transform duration-500">
        <img :src="racket.imageUrl" class="w-full h-full object-contain drop-shadow-md" :alt="racket.name" />
        <!-- Decorative element -->
        <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/20 to-transparent"></div>
      </div>

      <!-- Racket Specs Area -->
      <div class="flex-1 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px] border-b border-gray-50 pb-1">
            <span class="text-gray-400 font-medium">무게</span>
            <span class="font-bold text-gray-800">{{ racket.weight }}</span>
          </div>
          <div class="flex items-center justify-between text-[11px] border-b border-gray-50 pb-1">
            <span class="text-gray-400 font-medium">밸런스</span>
            <span class="font-bold text-gray-800">{{ racket.balance }}</span>
          </div>
          <div class="flex items-center justify-between text-[11px] border-b border-gray-50 pb-1">
            <span class="text-gray-400 font-medium">탄성</span>
            <span class="font-bold text-gray-800">{{ racket.shaftFlex }}</span>
          </div>
          <div class="flex items-center justify-between text-[11px] border-b border-gray-50 pb-1">
            <span class="text-gray-400 font-medium">최대장력</span>
            <span class="font-bold text-gray-800">{{ racket.maxTension }}</span>
          </div>
          <div class="flex items-center justify-between text-[11px] border-b border-gray-50 pb-1">
            <span class="text-gray-400 font-medium">그립</span>
            <span class="font-bold text-gray-800">{{ racket.gripSize }}</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <div v-for="color in racket.colors" :key="color" 
                 class="w-3 h-3 rounded-full border border-white shadow-sm"
                 :style="{ backgroundColor: color }"></div>
            <span class="text-[9px] text-gray-400 ml-1">주요색상</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags Area & Evaluation Footer -->
    <div class="mt-auto relative z-10 pt-3 border-t border-gray-100">
      <!-- Tags Area -->
      <div class="flex flex-wrap items-center justify-start gap-1.5 mb-2 min-h-[32px]">
        <span v-for="tag in racket.tags" :key="tag" 
          class="inline-flex items-center justify-center text-[10px] font-semibold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-100 cursor-default transition-colors">
          #{{ tag }}
        </span>
      </div>

      <!-- Evaluation Area -->
      <div class="flex items-center justify-between bg-gray-50/50 rounded-2xl p-2 border border-gray-100">
        <div class="flex gap-4 px-2">
          <button @click="vote('good')" class="group/btn relative flex flex-col items-center">
            <span class="text-xl filter grayscale group-hover/btn:grayscale-0 transition-all hover:scale-125">👍</span>
            <span class="text-[8px] font-bold text-gray-400 mt-0.5">좋아요</span>
          </button>
          <button @click="vote('soso')" class="group/btn relative flex flex-col items-center">
            <span class="text-xl filter grayscale group-hover/btn:grayscale-0 transition-all hover:scale-125">😐</span>
            <span class="text-[8px] font-bold text-gray-400 mt-0.5">보통</span>
          </button>
          <button @click="vote('bad')" class="group/btn relative flex flex-col items-center">
            <span class="text-xl filter grayscale group-hover/btn:grayscale-0 transition-all hover:scale-125">👎</span>
            <span class="text-[8px] font-bold text-gray-400 mt-0.5">별로</span>
          </button>
        </div>
        <div class="pr-3">
          <button class="text-xs font-bold text-blue-600 hover:underline">상세보기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  racket: {
    type: Object,
    required: true
  }
});

const vote = (type) => {
  console.log(`Voted ${type} for ${props.racket.name}`);
};
</script>