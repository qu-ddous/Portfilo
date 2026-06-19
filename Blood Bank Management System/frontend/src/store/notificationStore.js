import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

/**
 * notificationStore.js
 * Manages notifications state using Node/Express backend.
 */
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Fetch notifications from Backend
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/api/notifications');
      const notifications = res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      set({ notifications, unreadCount });
    } catch (err) {
      console.error('Notification fetch error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  // Mark single read
  markAsRead: async (id) => {
    try {
      const res = await axiosInstance.patch(`/api/notifications/${id}/read`);
      if (res.data.success) {
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          );
          return { notifications, unreadCount: notifications.filter(n => !n.is_read).length };
        });
      }
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      await axiosInstance.patch('/api/notifications/read-all');
      set((state) => {
        const notifications = state.notifications.map((n) => ({ ...n, is_read: true }));
        return { notifications, unreadCount: 0 };
      });
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  },

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

// Polling setup
let notificationPollingInterval = null;

export const startNotificationPolling = () => {
  if (notificationPollingInterval) return;
  useNotificationStore.getState().fetchNotifications();
  notificationPollingInterval = setInterval(() => {
    useNotificationStore.getState().fetchNotifications();
  }, 30000);
};

export const stopNotificationPolling = () => {
  if (notificationPollingInterval) {
    clearInterval(notificationPollingInterval);
    notificationPollingInterval = null;
  }
};
