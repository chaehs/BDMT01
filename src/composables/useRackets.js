import { ref } from 'vue';
import { supabase } from '../supabase';

export default function useRackets() {
  const rackets = ref([]);
  const loading = ref(false);

  const fetchRackets = async () => {
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from('rackets')
        .select('*, tags:tags(name)');

      if (error) {
        console.error('Error fetching rackets (original error):', error);
      }
      
      rackets.value = data || [];

    } catch (error) {
      console.error('Catched error in fetchRackets:', error);
    } finally {
      loading.value = false;
    }
  };

  return { rackets, loading, fetchRackets };
}
