// src/store/authStore.js
import { create } from 'zustand';
import { supabase } from '../services/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  // Initialize auth on app load
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ user: session.user, profile, loading: false });
      } else {
        set({ loading: false });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          set({ user: session.user, profile });
        } else {
          set({ user: null, profile: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
}));
