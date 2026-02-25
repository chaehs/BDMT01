import { ref } from 'vue'
import { supabase } from '../supabase'

const BUCKET_NAME = 'BDMT01';
const IMAGE_FOLDER = 'racket_storage';

export default function useRackets() {
  const rackets = ref([])
  const isLoading = ref(false)

  const fetchRackets = async (filters = {}) => {
    isLoading.value = true;
    try {
      let query = supabase.from('rackets').select('*');

      if (filters.brand) query = query.eq('brand', filters.brand);
      if (filters.weight) query = query.eq('weight', filters.weight);
      if (filters.balance) query = query.eq('balance', filters.balance);
      if (filters.flex) query = query.eq('flex', filters.flex);
      if (filters.search && filters.search.trim()) query = query.ilike('name', `%${filters.search.trim()}%`);
      if (filters.tags && filters.tags.length > 0) query = query.contains('tags', filters.tags);

      const { data, error } = await query.order('created_at', { ascending: false }).limit(20);

      if (error) throw error;
      rackets.value = data;
    } catch (error) {
      console.error('Error fetching rackets:', error.message);
      rackets.value = [];
    } finally {
      isLoading.value = false;
    }
  };
  
  const getRacketImage = (fileName) => {
    if (!fileName) return 'https://placehold.co/40x50/F3F4F6/9CA3AF?text=N/A'
    if (fileName.startsWith('http')) return fileName

    // Normalize the file name to be lowercase and use underscores
    const normalizedFileName = fileName.toLowerCase().replace(/\s+/g, '_');
    
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${IMAGE_FOLDER}/${normalizedFileName}`)
    return data.publicUrl
  }

  const deleteRacket = async (racket) => {
    // 1. Delete image from storage if it exists
    if (racket.image_url && !racket.image_url.startsWith('http')) {
      const filePath = `${IMAGE_FOLDER}/${racket.image_url.split('/').pop()}`
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (storageError) {
        // Log the error but don't block the process
        console.warn(`Could not delete image: ${filePath}. Reason: ${storageError.message}`);
      }
    }

    // 2. Delete the record from the database
    const { error: dbError } = await supabase.from('rackets').delete().eq('id', racket.id);
    if (dbError) throw dbError;
    
    // 3. Update local state immediately instead of re-fetching
    rackets.value = rackets.value.filter(r => r.id !== racket.id);
  }

  return {
    rackets,
    isLoading,
    fetchRackets,
    getRacketImage,
    deleteRacket
  }
}
