<template>
  <div class="flex items-center" :class="{ 'is-interactive': interactive }">
    <svg 
      v-for="star in 5" 
      :key="star"
      class="w-8 h-8 cursor-pointer transition-transform duration-200"
      :class="[getStarClass(star), { 'transform-gpu scale-125': interactive && hoveredStar === star } ]"
      viewBox="0 0 24 24"
      @click="handleClick(star)"
      @mouseenter="interactive ? hoveredStar = star : null"
      @mouseleave="interactive ? hoveredStar = 0 : null"
    >
      <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  initialRating: {
    type: Number,
    default: 0
  },
  interactive: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:rating']);

const localRating = ref(props.initialRating);
const hoveredStar = ref(0);

// props가 외부에서 변경될 때 localRating을 동기화합니다.
watch(() => props.initialRating, (newVal) => {
  localRating.value = newVal;
});

const displayedRating = computed(() => hoveredStar.value || localRating.value);

const getStarClass = (star) => {
  return star <= displayedRating.value ? 'text-yellow-400' : 'text-gray-300';
};

const handleClick = (star) => {
  if (props.interactive) {
    if (localRating.value === star) {
      // 이미 선택된 별을 다시 클릭하면 평점을 0으로 (취소)
      localRating.value = 0;
    } else {
      localRating.value = star;
    }
    emit('update:rating', localRating.value);
  }
};
</script>

<style scoped>
.is-interactive svg:hover {
  filter: drop-shadow(0 0 5px rgba(250, 204, 21, 0.7));
}
</style>
