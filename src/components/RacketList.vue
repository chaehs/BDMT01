<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <RacketCard 
        v-for="racket in rackets" 
        :key="racket.id" 
        :racket="racket"
        @edit-tags="openTagModal"
      />
    </div>
    <TagInputModal 
      :show="isModalOpen"
      :racket-id="selectedRacket?.id"
      :racket-name="selectedRacket?.name"
      :initial-tags="selectedRacket?.tags"
      @close="closeTagModal"
      @tags-updated="handleTagsUpdated"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RacketCard from './RacketCard.vue';
import TagInputModal from './TagInputModal.vue';

const props = defineProps({
  rackets: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['refresh-rackets']);

const isModalOpen = ref(false);
const selectedRacket = ref(null);

const openTagModal = (racket) => {
  selectedRacket.value = racket;
  isModalOpen.value = true;
};

const closeTagModal = () => {
  isModalOpen.value = false;
  selectedRacket.value = null;
};

const handleTagsUpdated = (racketId, updatedTags) => {
  // NOTE: This logic is from the pre-tag-fix state.
  const racket = props.rackets.find(r => r.id === racketId);
  if (racket) {
    racket.tags = updatedTags;
  }
  // We might still want to emit refresh to ensure consistency if other
  // parts of the app rely on it, but the primary update is local.
  emit('refresh-rackets'); 
};
</script>
