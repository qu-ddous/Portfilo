// src/router/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};
