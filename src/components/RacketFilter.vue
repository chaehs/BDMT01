<template>
  <div class="mb-12 max-w-4xl mx-auto space-y-6">
    <!-- Filter controls row -->
    <!-- Layout restructuring: Search top, Filters bottom -->
    <div class="flex flex-col gap-5 w-full">
      
      <!-- Top Row: Search & Reset -->
      <div class="flex items-center gap-3 w-full">
        <div class="relative flex-1">
          <input 
            :value="modelValue.search"
            @input="updateFilter('search', $event.target.value)"
            type="text" 
            placeholder="라켓명, #태그 검색 (브랜드, 모델명 등)..." 
            class="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-medium"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        </div>
        <button @click="$emit('reset')" class="flex-shrink-0 px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors">
          초기화
        </button>
      </div>

      <!-- Bottom Row: Select Filters -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center md:justify-center gap-2 w-full">
        <select 
          v-for="filter in [
            { key: 'brand', label: '브랜드', options: brands },
            { key: 'weight', label: '무게', options: weights },
            { key: 'balance', label: '밸런스', options: balances },
            { key: 'flex', label: '탄성', options: flexes },
            { key: 'color', label: '색상', options: colors }
          ]"
          :key="filter.key"
          :value="modelValue[filter.key]" 
          @change="updateFilter(filter.key, $event.target.value)"
          class="w-full md:w-[125px] px-4 py-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-600 cursor-pointer hover:border-gray-200"
        >
          <option value="">{{ filter.label }}</option>
          <option v-for="opt in filter.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
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
const weights = ['3U', '4U', '5U', '6U', '7U', 'F']
const balances = ['HEAD LIGHT', 'EVEN BALANCE', 'HEAD HEAVY']
const flexes = ['FLEXIBLE', 'MEDIUM', 'STIFF']
const colors = ['RED', 'BLUE', 'BLACK', 'WHITE', 'YELLOW', 'GREEN', 'ORANGE', 'PINK', 'PURPLE', 'SILVER', 'GOLD', 'NAVY', 'GREY']
const popularTags = ['초보자용', '소리좋음', '잘깨짐', '가성비', '공격형', '수비형']

const updateFilter = (key, value) => {
  const newFilters = { ...props.modelValue, [key]: value }
  emit('update:modelValue', newFilters)
}
</script>
