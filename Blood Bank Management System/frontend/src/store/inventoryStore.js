import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

/**
 * inventoryStore.js
 * Manages blood inventory state using Node/Express backend.
 */
export const useInventoryStore = create(
  persist(
    (set, get) => ({
      inventory: [],          
      lowStockTypes: [],       
      lastFetched: null,
      isLoading: false,

      // Fetch inventory from Node.js Backend
      fetchInventory: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get('/api/inventory');
          const inventory = res.data.success ? res.data.data : (Array.isArray(res.data) ? res.data : []);

          // Calculate low stock types (< 10 units total)
          const totals = {};
          inventory.forEach((item) => {
             totals[item.blood_type] = (totals[item.blood_type] || 0) + item.units;
          });

          const lowStockTypes = Object.entries(totals)
            .filter(([, units]) => units < 10)
            .map(([type]) => type);

          set({ inventory, lowStockTypes, lastFetched: new Date().toISOString() });
        } catch (err) {
          console.error('Inventory fetch error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      // Update stock via API (ID-based)
      processStockUpdate: async (id, units, operation) => {
        try {
          const res = await axiosInstance.put(`/api/inventory/${id}`, { units, operation });
          if (res.data.success) {
            get().fetchInventory(); 
            return res.data;
          }
        } catch (err) {
          console.error('Update stock error:', err);
          throw err;
        }
      },

      addInventory: async (item) => {
        try {
          const res = await axiosInstance.post('/api/inventory', item);
          if (res.data.success) {
            get().fetchInventory();
            return res.data;
          }
        } catch (err) {
          console.error('Add inventory error:', err);
          throw err;
        }
      },

      deleteInventory: async (id) => {
        try {
          const res = await axiosInstance.delete(`/api/inventory/${id}`);
          if (res.data.success) {
            get().fetchInventory();
            return res.data;
          }
        } catch (err) {
          console.error('Delete inventory error:', err);
          throw err;
        }
      },

      clearInventory: () => set({ inventory: [], lowStockTypes: [], lastFetched: null }),
    }),
    {
      name: 'bloodlink-inventory-storage',
    }
  )
);

// Polling setup
let inventoryPollingInterval = null;

export const startInventoryPolling = () => {
  if (inventoryPollingInterval) return;
  useInventoryStore.getState().fetchInventory();
  inventoryPollingInterval = setInterval(() => {
    useInventoryStore.getState().fetchInventory();
  }, 30000);
};

export const stopInventoryPolling = () => {
  if (inventoryPollingInterval) {
    clearInterval(inventoryPollingInterval);
    inventoryPollingInterval = null;
  }
};
