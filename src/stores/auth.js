import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const profile = ref(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => {
    // profile이 존재하고 role이 'admin'인지 명확하게 체크
    return profile.value && profile.value.role === 'admin';
  });

  async function fetchProfile(userId) {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // single() 대신 maybeSingle() 사용하여 406 에러 방지
      
      if (error) throw error;
      profile.value = data || null;
    } catch (error) {
      console.error('Profile fetch failed:', error.message);
      profile.value = null;
    }
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    profile.value = null;
  }

  async function checkUser() {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      user.value = supabaseUser || null;
      if (user.value) {
        await fetchProfile(user.value.id);
      } else {
        profile.value = null;
      }
    } catch (error) {
      console.error('CheckUser failed:', error.message);
    }
  }

  // Auth 리스너는 앱 생명주기 동안 한 번만 등록되도록 설정 (Pinia 스토어 내에서 관리)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
      user.value = session?.user || null;
      if (user.value) {
        await fetchProfile(user.value.id);
      } else {
        profile.value = null;
      }
    }
  });

  return { user, profile, isAuthenticated, isAdmin, loginWithGoogle, logout, checkUser };
});
