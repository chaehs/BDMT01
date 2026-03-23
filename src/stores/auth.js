
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

  return { user, isAdmin, isInitialized, init };
});
