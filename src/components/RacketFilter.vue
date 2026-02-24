<template>
  <div class="mb-12 max-w-4xl mx-auto space-y-6">
    <div class="flex flex-wrap justify-center gap-4">
      <!-- Brand Filter -->
      <select 
        :value="modelValue.brand" 
        @change="updateFilter('brand', $event.target.value)"
        class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600"
      >
        <option value="">브랜드 전체</option>
        <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
      </select>

      <!-- Weight Filter -->
      <select 
        :value="modelValue.weight" 
        @change="updateFilter('weight', $event.target.value)"
        class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600"
      >
        <option value="">무게 전체</option>
        <option v-for="w in weights" :key="w" :value="w">{{ w }}</option>
      </select>

      <!-- Balance Filter -->
      <select 
        :value="modelValue.balance" 
        @change="updateFilter('balance', $event.target.value)"
        class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600"
      >
        <option value="">밸런스 전체</option>
        <option v-for="b in balances" :key="b" :value="b">{{ b }}</option>
      </select>

      <!-- Flex Filter -->
      <select 
        :value="modelValue.flex" 
        @change="updateFilter('flex', $event.target.value)"
        class="px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600"
      >
        <option value="">탄성 전체</option>
        <option v-for="f in flexes" :key="f" :value="f">{{ f }}</option>
      </select>

      <!-- Search Input -->
      <div class="relative flex-1 min-w-[200px]">
        <input 
          :value="modelValue.search"
          @input="updateFilter('search', $event.target.value)"
          type="text" 
          placeholder="라켓 명칭 검색..." 
          class="w-full pl-10 pr-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-medium"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <!-- Reset Button -->
      <button @click="$emit('reset')" class="px-4 py-2 bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors">
        초기화
      </button>
    </div>
    
    <!-- Popular Tags for Search -->
    <div class="flex flex-wrap justify-center gap-2">
      <button 
        v-for="tag in popularTags" 
        :key="tag"
        @click="$emit('toggle-tag', tag)"
        :class="[
          'text-xs font-bold px-3 py-1.5 rounded-full transition-all shadow-sm border',
          modelValue.tags.includes(tag) 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50'
        ]"
      >
        #{{ tag }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'reset', 'toggle-tag'])

const brands = ['YONEX', 'VICTOR', 'LI-NING', 'MIZUNO']
const weights = ['3U', '4U', '5U', 'F']
const balances = ['HEAD LIGHT', 'EVEN BALANCE', 'HEAD HEAVY']
const flexes = ['FLEXIBLE', 'MEDIUM', 'STIFF', 'EXTRA STIFF']
const popularTags = ['초보자용', '소리좋음', '잘깨짐', '가성비', '공격형', '수비형']

const updateFilter = (key, value) => {
  const newFilters = { ...props.modelValue, [key]: value }
  emit('update:modelValue', newFilters)
}
</script>
