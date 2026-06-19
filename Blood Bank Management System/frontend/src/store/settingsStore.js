import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useSettingsStore = create((set) => ({
  settings: {
    hospital_name: 'BloodLink Hub',
    emergency_mode: false,
    public_stocks_view: true
  },
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/api/settings');
      if (res.data.success) {
        set({ settings: res.data.data });
      }
    } catch (err) {
      console.error('Failed to sync settings store');
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  }
}));
