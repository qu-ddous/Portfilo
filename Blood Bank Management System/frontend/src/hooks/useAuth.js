import { useAuthStore } from '../store/authStore';
import { login, logout, signup } from '../api/auth';

export const useAuth = () => {
  const { user, isAuthenticated, token, setUser } = useAuthStore();

  return {
    user,
    isAuthenticated,
    token,
    setUser,
    login,
    logout,
    signup
  };
};
