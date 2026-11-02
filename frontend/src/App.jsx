import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import UserProfile from './pages/UserProfile/UserProfile';
import LevelPage from './pages/Levels/LevelPage';
import Login from './pages/Login/Login';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminWithdrawals from './pages/Admin/AdminWithdrawals';
import AdminAuditLogs from './pages/Admin/AdminAuditLogs';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import AdminRoute from './components/Routes/AdminRoute';

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/user-profile" replace />} />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/levels"
            element={
              <ProtectedRoute>
                <LevelPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/withdrawals"
            element={
              <AdminRoute>
                <AdminWithdrawals />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <AdminRoute>
                <AdminAuditLogs />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/user-profile" replace />} />
        </Routes>
      </div>

      <footer
        className="py-3 text-center border-top small"
        style={{
          background: 'rgba(12, 14, 26, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          color: '#8492a6',
        }}
      >
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span>&copy; {new Date().getFullYear()} VELoop Rewards Platform. Full-Stack MERN Implementation.</span>
          <div className="d-flex gap-3">
            <span className="badge bg-success-subtle text-success border border-success-subtle">
              ● Backend API Online
            </span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
              MongoDB Mongoose Ledger
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
