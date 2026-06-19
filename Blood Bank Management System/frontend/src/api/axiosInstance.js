import axios from 'axios';

// Base instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor for Auth
axiosInstance.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem('bloodlink-auth-storage') || '{}');
  if (authData?.state?.token) {
    config.headers.Authorization = `Bearer ${authData.state.token}`;
  }
  return config;
});

export default axiosInstance;
