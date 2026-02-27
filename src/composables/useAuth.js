
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

const user = ref(null);

export function useAuth() {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data.user;
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  onMounted(() => {
    checkUser();
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null;
    });
  });

  return {
    user,
    loginWithGoogle,
    logout,
  };
}
