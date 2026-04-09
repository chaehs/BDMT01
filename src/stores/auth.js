
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAdmin = ref(false);
  const isInitialized = ref(false);

  const checkUser = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      user.value = supabaseUser;
      
      if (user.value) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.value.id)
          .single();
        isAdmin.value = profile?.role === 'admin';
      }
    } catch (e) {
      console.error('Auth init error:', e);
    } finally {
      isInitialized.value = true;
    }
  };

  const init = () => {
    checkUser();
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null;
      if (!user.value) isAdmin.value = false;
      // 세션 변경 시 관리자 체크 로직은 필요시 추가
    });
  };

  const withdraw = async () => {
    if (!user.value) return;
    
    try {
      // 1. 프로필 삭제 (DB에서 관련 데이터 익명화 처리가 완료됨을 전제로 함)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.value.id);
      
      if (error) throw error;

      // 3. 로그아웃 처리
      await supabase.auth.signOut();
      user.value = null;
      isAdmin.value = false;
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      throw error;
    }
  };

  return { user, isAdmin, isInitialized, init, withdraw };
});
