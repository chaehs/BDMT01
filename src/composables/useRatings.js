import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

export default function useRatings(racketId) {
  const ratingStats = ref({
    avg: 0,
    count: 0,
  });
  const userRating = ref(null);
  const isLoading = ref(false);

  const fetchRatingStats = async () => {
    const { data, error } = await supabase.rpc('get_racket_stats', { r_id: racketId });

    if (error) {
      console.error('Error fetching racket stats:', error);
      ratingStats.value = { avg: 0, count: 0 };
      return;
    }

    if (data && data.length > 0) {
      const stats = data[0];
      ratingStats.value = {
        avg: stats.avg_score || 0,
        count: stats.total_count || 0,
      };
    } else {
      ratingStats.value = { avg: 0, count: 0 };
    }
  };

  const fetchUserRating = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('ratings')
      .select('score')
      .eq('racket_id', racketId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user rating:', error);
    }
    userRating.value = data ? data.score : null;
  };

  const submitRating = async (score) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    isLoading.value = true;
    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          racket_id: racketId,
          user_id: user.id,
          score: score,
        }, {
          onConflict: 'racket_id, user_id'
        });

      if (error) throw error;

      userRating.value = score;
      await fetchRatingStats();

    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('평점 제출에 실패했습니다.');
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    isLoading.value = true;
    await Promise.all([fetchRatingStats(), fetchUserRating()]);
    isLoading.value = false;
  });

  return {
    ratingStats,
    userRating,
    isLoading,
    submitRating,
  };
}
