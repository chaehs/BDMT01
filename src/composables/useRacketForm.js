import { ref, onMounted, watch } from 'vue';
import { supabase } from '../supabase';
import { useRouter, useRoute } from 'vue-router';

export function useRacketForm() {
  const router = useRouter();
  const route = useRoute();
  const isEdit = ref(false);
  const racketId = ref(null);
  const racket = ref({
    brand: '',
    name: '',
    weight: '',
    balance: '',
    bal_point: null,
    flex: '',
    max_tension: null,
    grip_size: '',
    image_url: '',
    tags: []
  });
  const isLoading = ref(false);
  const isUploading = ref(false);
  const lastSaved = ref(null);

  const loadRacketData = async () => {
    if (racketId.value) {
      isLoading.value = true;
      const { data, error } = await supabase
        .from('rackets')
        .select('*, tags(name)')
        .eq('id', racketId.value)
        .single();
      if (error) {
        console.error('Error fetching racket:', error);
      } else {
        racket.value = {
          ...data,
          tags: data.tags ? data.tags.map(t => t.name) : []
        };
      }
      isLoading.value = false;
    }
  };

  const saveTags = async (currentRacketId, tags) => {
    // 1. Get all existing tags from the 'tags' table
    const { data: allTags, error: fetchTagsError } = await supabase.from('tags').select('id, name');
    if(fetchTagsError) throw fetchTagsError;

    // 2. Find or create tags to get their IDs
    const tagIds = await Promise.all(tags.map(async (tagName) => {
        let tag = allTags.find(t => t.name === tagName);
        if (tag) return tag.id;

        const { data, error } = await supabase.from('tags').insert({ name: tagName }).select().single();
        if (error) throw error;
        return data.id;
    }));

    // 3. Clear and insert new tag mappings
    await supabase.from('racket_tag_map').delete().eq('racket_id', currentRacketId);
    if (tagIds.length > 0) {
        const mappings = tagIds.map(tagId => ({ racket_id: currentRacketId, tag_id: tagId }));
        const { error: insertError } = await supabase.from('racket_tag_map').insert(mappings);
        if (insertError) throw insertError;
    }
  }

  const autoSave = async () => {
    if (!racket.value.name || !racketId.value) return;

    const { tags, ...racketData } = racket.value;
    
    const { error } = await supabase
      .from('rackets')
      .update(racketData)
      .eq('id', racketId.value);

    if (error) {
      return console.error('Auto-save racket data error:', error);
    }

    try {
        await saveTags(racketId.value, tags);
        lastSaved.value = new Date().toLocaleTimeString();
        console.log('Auto-saved at', lastSaved.value);
    } catch (error) {
        console.error('Auto-save tags error:', error);
    }
  };

  const handleSubmit = async () => {
    isLoading.value = true;
    let savedRacket;

    // Separate tags from racket data
    const { tags, ...racketData } = racket.value;

    if (isEdit.value) {
      const { data, error } = await supabase
        .from('rackets')
        .update(racketData)
        .eq('id', racketId.value)
        .select()
        .single();
      if(error) {
          alert('Error updating racket: ' + error.message);
          isLoading.value = false;
          return;
      }
      savedRacket = data;
    } else {
      const { data, error } = await supabase
        .from('rackets')
        .insert(racketData)
        .select()
        .single();
      if(error) {
          alert('Error creating racket: ' + error.message);
          isLoading.value = false;
          return;
      }
      savedRacket = data;
    }
    
    // Save tags
    try {
      await saveTags(savedRacket.id, tags);
    } catch (error) {
      alert('Error saving tags: ' + error.message);
      isLoading.value = false;
      return;
    }

    isLoading.value = false;
    alert(isEdit.value ? '라켓 정보가 수정되었습니다.' : '새로운 라켓이 등록되었습니다.');
    router.push('/admin/rackets');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    isUploading.value = true;
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('BDMT01/racket_storage')
      .upload(fileName, file);
    
    if (error) {
      alert('이미지 업로드에 실패했습니다: ' + error.message);
      console.error('Upload error:', error);
    } else {
      racket.value.image_url = fileName;
    }
    isUploading.value = false;
  };

  onMounted(() => {
    if (route.params.id) {
      isEdit.value = true;
      racketId.value = route.params.id;
      loadRacketData();
    }
  });

  let debounceTimer;
  watch(() => racket.value, (newValue, oldValue) => {
      if (isEdit.value && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(autoSave, 2000); 
      }
  }, { deep: true });

  return {
    racket,
    isEdit,
    isLoading,
    isUploading,
    lastSaved,
    handleSubmit,
    handleFileUpload
  };
}
