
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';

const BUCKET_NAME = 'BDMT01';
const IMAGE_FOLDER = 'racket_storage';

export const useRacketStore = defineStore('racket', () => {
  const rackets = ref([]);
  const isLoading = ref(false);

  const fetchRackets = async (filters = {}) => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    try {
      let query = supabase.from('rackets').select('*, tags(*)');

      if (filters.brand) query = query.ilike('brand', filters.brand);
      if (filters.weight) query = query.ilike('weight', filters.weight);
      if (filters.balance) query = query.ilike('balance', filters.balance);
      if (filters.flex) query = query.ilike('flex', filters.flex);
      
      if (filters.search && filters.search.trim()) {
        query = query.ilike('name', `%${filters.search.trim()}%`);
      }

      const { data, error } = await query.order('name', { ascending: true }).limit(30);

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
