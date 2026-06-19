// src/router/index.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// ═══════════════════════════════════════
// PAGE IMPORTS
// ═══════════════════════════════════════

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import ElectionDetailPage from '../pages/public/ElectionDetailPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ApprovalQueuePage from '../pages/admin/ApprovalQueuePage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';

// Creator Pages
import CreatorDashboard from '../pages/creator/CreatorDashboard';
import CreateElectionPage from '../pages/creator/CreateElectionPage';
import ManageCandidatesPage from '../pages/creator/ManageCandidatesPage';
import ElectionControlPage from '../pages/creator/ElectionControlPage';
import MyElectionsPage from '../pages/creator/MyElectionsPage';

// Voter Pages
import VoterDashboard from '../pages/voter/VoterDashboard';
import CastVotePage from '../pages/voter/CastVotePage';
import VoteConfirmationPage from '../pages/voter/VoteConfirmationPage';

// ═══════════════════════════════════════
// ROUTER CONFIGURATION
// ═══════════════════════════════════════

const router = createBrowserRouter([
  // ═══ PUBLIC ROUTES ═══
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/election/:id',
    element: <ElectionDetailPage />
  },

  // ═══ AUTH ROUTES ═══
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },

  // ═══ ADMIN ROUTES ═══
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['super_admin']}>
          <AdminDashboard />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/approvals',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['super_admin']}>
          <ApprovalQueuePage />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/audit-logs',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['super_admin']}>
          <AuditLogsPage />
        </RoleRoute>
      </ProtectedRoute>
    )
  },

  // ═══ CREATOR ROUTES ═══
  {
    path: '/creator/dashboard',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['election_creator']}>
          <CreatorDashboard />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/creator/create',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['election_creator']}>
          <CreateElectionPage />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/creator/manage-candidates/:electionId',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['election_creator']}>
          <ManageCandidatesPage />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/creator/control/:electionId',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['election_creator']}>
          <ElectionControlPage />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/creator/elections',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['election_creator']}>
          <MyElectionsPage />
        </RoleRoute>
      </ProtectedRoute>
    )
  },

  // ═══ VOTER ROUTES ═══
  {
    path: '/voter/dashboard',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['voter']}>
          <VoterDashboard />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/election/:electionId/vote',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['voter']}>
          <CastVotePage />
        </RoleRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/vote-confirmation/:electionId',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={['voter']}>
          <VoteConfirmationPage />
        </RoleRoute>
      </ProtectedRoute>
    )
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
