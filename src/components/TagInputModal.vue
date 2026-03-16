<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" @click.self="close">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-1">"{{ racketName }}"</h3>
      <p class="text-gray-500 text-sm mb-5">태그 추가/수정</p>

      <!-- Tag Input -->
      <div class="relative mb-4">
        <input
          v-model="tagInput"
          @keydown.enter.prevent="handleEnterKey"
          @keydown.down.prevent="highlightNext"
          @keydown.up.prevent="highlightPrev"
          @keydown.esc="filteredTags = []"
          placeholder="태그를 입력하거나 선택하세요"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Autocomplete List -->
        <ul v-if="filteredTags.length > 0" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-auto">
          <li
            v-for="(tag, index) in filteredTags"
            :key="tag.id"
            @click="addTag(tag.name)"
            :class="{'bg-blue-500 text-white': index === highlightIndex}"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            {{ tag.name }}
          </li>
        </ul>
      </div>

      <!-- Current Tags -->
      <div class="flex flex-wrap gap-2 mb-6 min-h-[3rem] bg-gray-50 p-3 rounded-lg border">
        <span v-for="tag in currentTags" :key="tag" class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full animate-fade-in">
          {{ tag }}
          <button @click="removeTag(tag)" type="button" class="ml-1.5 flex-shrink-0 text-blue-500 hover:text-blue-700">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
          </button>
        </span>
         <p v-if="currentTags.length === 0" class="text-sm text-gray-500 p-2">입력된 태그가 없습니다.</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4">
        <button @click="close" class="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors">취소</button>
        <button @click="saveTags" :disabled="isLoading" class="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400">
          <span v-if="isLoading">저장 중...</span>
          <span v-else>저장</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { supabase } from '../supabase';

const props = defineProps({
  show: Boolean,
  racketId: Number,
  racketName: String,
  initialTags: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'tags-updated']);

const isLoading = ref(false);
const currentTags = ref([]);
const tagInput = ref('');
const allTags = ref([]);
const filteredTags = ref([]);
const highlightIndex = ref(-1);

watch(() => props.show, (newVal) => {
  if (newVal) {
    currentTags.value = [...(props.initialTags || [])];
    tagInput.value = '';
    filteredTags.value = [];
  }
});

onMounted(async () => {
  const { data, error } = await supabase.from('tags').select('id, name');
  if (error) console.error('Error fetching tags:', error);
  else allTags.value = data;
});

watch(tagInput, (newVal) => {
  if (newVal) {
    filteredTags.value = allTags.value.filter(tag =>
      tag.name.toLowerCase().includes(newVal.toLowerCase()) && !currentTags.value.includes(tag.name)
    );
    highlightIndex.value = -1;
  } else {
    filteredTags.value = [];
  }
});

const addTag = (tagName) => {
  const trimmedTag = tagName.trim();
  if (trimmedTag && !currentTags.value.includes(trimmedTag)) {
    currentTags.value.push(trimmedTag);
  }
  tagInput.value = '';
  filteredTags.value = [];
};

const removeTag = (tagName) => {
  currentTags.value = currentTags.value.filter(t => t !== tagName);
};

const saveTags = async () => {
  isLoading.value = true;

  // 1. Find or create tags to get their IDs
  const tagIds = await Promise.all(currentTags.value.map(async (tagName) => {
    let tag = allTags.value.find(t => t.name === tagName);
    if (tag) return tag.id;

    // If tag doesn't exist, create it
    const { data, error } = await supabase.from('tags').insert({ name: tagName }).select().single();
    if (error) throw error;
    allTags.value.push(data); // Add new tag to local cache
    return data.id;
  }));

  // 2. Clear existing tag mappings for this racket
  const { error: deleteError } = await supabase.from('racket_tag_map').delete().eq('racket_id', props.racketId);
  if (deleteError) {
      isLoading.value = false;
      return alert('Error clearing old tags: ' + deleteError.message);
  }

  // 3. Insert new tag mappings
  if (tagIds.length > 0) {
      const mappings = tagIds.map(tagId => ({ racket_id: props.racketId, tag_id: tagId }));
      const { error: insertError } = await supabase.from('racket_tag_map').insert(mappings);
       if (insertError) {
            isLoading.value = false;
            return alert('Error saving new tags: ' + insertError.message);
        }
  }

  isLoading.value = false;
  emit('tags-updated', props.racketId, currentTags.value);
  close();
};

const close = () => {
  emit('close');
};

const highlightNext = () => {
  if (filteredTags.value.length === 0) return;
  if (highlightIndex.value < filteredTags.value.length - 1) {
    highlightIndex.value++;
  } else {
    highlightIndex.value = 0;
  }
};

const highlightPrev = () => {
    if (filteredTags.value.length === 0) return;
  if (highlightIndex.value > 0) {
    highlightIndex.value--;
  } else {
    highlightIndex.value = filteredTags.value.length - 1;
  }
};

const handleEnterKey = () => {
    if (highlightIndex.value >= 0 && filteredTags.value[highlightIndex.value]) {
        addTag(filteredTags.value[highlightIndex.value].name);
    } else {
        addTag(tagInput.value);
    }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
