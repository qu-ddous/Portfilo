import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/public/Login';
import Signup from '../pages/public/Signup';
import Landing from '../pages/public/Landing';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { AdminLayout }   from '../components/layout/AdminLayout';
import { StaffLayout }   from '../components/layout/StaffLayout';
import { DonorLayout }   from '../components/layout/DonorLayout';
import { PatientLayout } from '../components/layout/PatientLayout';
import { PublicLayout }  from '../components/layout/PublicLayout';

import AdminDashboard from '../pages/admin/Dashboard';
import DonorsManagement from '../pages/admin/Donors';
import BloodInventory from '../pages/admin/Inventory';
import BloodRequests from '../pages/admin/Requests';
import PatientsManagement from '../pages/admin/Patients';
import StaffManagement from '../pages/admin/Staff';
import GeneralReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

import StaffDashboard from '../pages/staff/Dashboard';
import RegisterDonor from '../pages/staff/RegisterDonor';
import RecordDonation from '../pages/staff/RecordDonation';
import TestResults from '../pages/staff/TestResults';
import ManageBloodRequests from '../pages/staff/ManageRequests';
import StaffProfile from '../pages/staff/Profile';

import DonorDashboard from '../pages/donor/Dashboard';
import DonationHistory from '../pages/donor/History';
import DonorCertificate from '../pages/donor/Certificate';
import DonorProfile from '../pages/donor/Profile';

import PatientDashboard from '../pages/patient/Dashboard';
import SubmitBloodRequest from '../pages/patient/SubmitRequest';
import TrackRequests from '../pages/patient/TrackRequest';
import PatientProfile from '../pages/patient/Profile';

// Placeholder — replaced per phase as pages are built
const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 border-2 border-red-100">
      <span className="text-4xl">🩸</span>
    </div>
    <h2 className="text-2xl font-black text-[#2C3E50] mb-2">{title}</h2>
    <p className="text-[#7F8C8D] font-medium">This page is coming soon — Phase in progress.</p>
  </div>
);

export const AppRouter = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated && user?.role
            ? <Navigate to={`/${user.role}/dashboard`} replace />
            : <Navigate to="/home" replace />
        }
      />

      {/* ===== PUBLIC ROUTES ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Landing />} />
      </Route>

      {/* Auth pages (no layout wrapper) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} replace /> : <Signup />}
      />

      {/* ===== ADMIN ROUTES ===== */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/donors"    element={<DonorsManagement />} />
          <Route path="/admin/patients"  element={<PatientsManagement />} />
          <Route path="/admin/staff"     element={<StaffManagement />} />
          <Route path="/admin/inventory" element={<BloodInventory />} />
          <Route path="/admin/requests"  element={<BloodRequests />} />
          <Route path="/admin/reports"   element={<GeneralReports />} />
          <Route path="/admin/settings"  element={<AdminSettings />} />
        </Route>
      </Route>

      {/* ===== STAFF ROUTES ===== */}
      <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard"        element={<StaffDashboard />} />
          <Route path="/staff/register-donor"   element={<RegisterDonor />} />
          <Route path="/staff/record-donation"  element={<RecordDonation />} />
          <Route path="/staff/test-results"     element={<TestResults />} />
          <Route path="/staff/manage-requests"  element={<ManageBloodRequests />} />
          <Route path="/staff/profile"          element={<StaffProfile />} />
        </Route>
      </Route>

      {/* ===== DONOR ROUTES ===== */}
      <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
        <Route element={<DonorLayout />}>
          <Route path="/donor/dashboard"    element={<DonorDashboard />} />
          <Route path="/donor/history"      element={<DonationHistory />} />
          <Route path="/donor/certificate"  element={<DonorCertificate />} />
          <Route path="/donor/profile"      element={<DonorProfile />} />
        </Route>
      </Route>

      {/* ===== PATIENT ROUTES ===== */}
      <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route element={<PatientLayout />}>
          <Route path="/patient/dashboard"      element={<PatientDashboard />} />
          <Route path="/patient/submit-request" element={<SubmitBloodRequest />} />
          <Route path="/patient/track-request"  element={<TrackRequests />} />
          <Route path="/patient/profile"        element={<PatientProfile />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
