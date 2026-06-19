// src/router/RoleRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthStore } from '../store/authStore';

export default function RoleRoute({ roles = [] }) {
  const { profile } = useAuthStore();

  if (!profile || !roles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

RoleRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string)
};
