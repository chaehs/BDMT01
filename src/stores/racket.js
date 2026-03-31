
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';

const BUCKET_NAME = 'BDMT01';
const IMAGE_FOLDER = 'racket_storage';

export const useRacketStore = defineStore('racket', () => {
  const rackets = ref([]);
  const isLoading = ref(false);

  const fetchRackets = async () => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    try {
      let query = supabase.from('rackets').select('*, tags(*)');

      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      rackets.value = data || [];

    } catch (error) {
      console.error('Error fetching rackets:', error.message);
      rackets.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const getRacketImage = (fileName) => {
    if (!fileName) return 'https://placehold.co/300x300/F3F4F6/9CA3AF?text=NO+IMAGE';
    if (fileName.startsWith('http')) return fileName;
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${IMAGE_FOLDER}/${fileName}`);
    return data.publicUrl;
  };

  const deleteRacket = async (racket) => {
    try {
      if (racket.image_url && !racket.image_url.startsWith('http')) {
        const filePath = `${IMAGE_FOLDER}/${racket.image_url}`;
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      }
      const { error } = await supabase.from('rackets').delete().eq('id', racket.id);
      if (error) throw error;
      rackets.value = rackets.value.filter(r => r.id !== racket.id);
    } catch (e) {
      console.error('Delete failed:', e);
      throw e;
    }
  };

  return {
    rackets,
    isLoading,
    fetchRackets,
    getRacketImage,
    deleteRacket
  };
});
