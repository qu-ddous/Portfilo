import axiosInstance from './axiosInstance';
import { useAuthStore } from '../store/authStore';

export const login = async (email, password) => {
  const { data } = await axiosInstance.post('/api/auth/login', { email, password });
  
  const authData = {
    token: data.token,
    user: data.user
  };

  useAuthStore.getState().setUser(authData);
  return authData;
};

export const signup = async (email, password, role, extraData) => {
  const { data } = await axiosInstance.post('/api/auth/register', {
    email,
    password,
    role,
    ...extraData
  });

  return data;
};

export const logout = async () => {
  useAuthStore.getState().clearUser();
  // Clear local storage if handled in store
};
