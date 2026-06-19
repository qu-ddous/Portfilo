import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (data) => {
        // Handle both {user, token} and just { ...userData }
        if (data.user) {
          set({ 
            user: data.user, 
            token: data.token || null, 
            isAuthenticated: true 
          });
        } else {
          set((state) => ({ 
            user: { ...state.user, ...data },
            isAuthenticated: true 
          }));
        }
      },
      clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'bloodlink-auth-storage',
    }
  )
);
