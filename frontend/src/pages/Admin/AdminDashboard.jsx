import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Coins,
  ArrowDownCircle,
  Share2,
  ShieldAlert,
  Clock,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Award,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = () => {
  const { adminUser, logoutAdmin } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.admin.getDashboard();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading metrics...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: 500 }}>
          {error || 'Could not load administrative data.'}
          <div className="mt-3">
            <button onClick={fetchStats} className="btn btn-sm btn-outline-danger">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { users, balances, withdrawals, referrals, recentAuditLogs } = stats;

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: 1240 }}>
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="h3 fw-bold mb-0">Admin Management Console</h1>
            <span className="badge bg-danger text-white">Super Admin</span>
          </div>
          <p className="text-muted small mb-0">
            Real-time control over users, wallet ledger, withdrawals, and platform rules.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={fetchStats}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3"
            title="Refresh metrics"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={logoutAdmin}
            className="btn btn-sm btn-outline-danger rounded-pill px-3"
          >
            Sign Out Admin
          </button>
        </div>
      </div>

      {/* Navigation Sub-menu */}
      <div
        className="p-2 mb-4 d-flex gap-2 flex-wrap"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <Link to="/admin/dashboard" className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold">
          Dashboard Overview
        </Link>
        <Link to="/admin/users" className="btn btn-sm btn-light border rounded-pill px-3">
          User Management
        </Link>
        <Link to="/admin/withdrawals" className="btn btn-sm btn-light border rounded-pill px-3">
          Withdrawal Requests ({withdrawals?.pending || 0})
        </Link>
        <Link to="/admin/audit-logs" className="btn btn-sm btn-light border rounded-pill px-3">
          Security Audit Logs
        </Link>
      </div>

      {/* KPI Cards Row 1: Users & Balances */}
      <div className="row g-3 mb-4">
        {/* Total Users */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">TOTAL USERS</span>
              <div
                className="p-2 rounded-circle"
                style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}
              >
                <Users size={18} />
              </div>
            </div>
            <div className="fs-3 fw-bold">{users.total}</div>
            <div className="small text-muted mt-1">
              <span className="text-success fw-bold">{users.active} Active</span> • {users.suspended} Suspended
            </div>
          </div>
        </div>

        {/* Total VEs in Circulation */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">TOTAL VES CIRCULATING</span>
              <div
                className="p-2 rounded-circle"
                style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}
              >
                <Coins size={18} />
              </div>
            </div>
            <div className="fs-3 fw-bold">{balances.totalVes.toLocaleString()}</div>
            <div className="small text-muted mt-1">
              ≈ ₹{(balances.totalVes * 0.5).toLocaleString()} Liability
            </div>
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">PENDING PAYOUTS</span>
              <div
                className="p-2 rounded-circle"
                style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}
              >
                <Clock size={18} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-warning">{withdrawals.pending}</div>
            <div className="small text-muted mt-1">
              {withdrawals.totalRequests} Total requests lifetime
            </div>
          </div>
        </div>

        {/* Total Amount Paid Out */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">TOTAL PAID OUT</span>
              <div
                className="p-2 rounded-circle"
                style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
              >
                <CheckCircle size={18} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-success">
              ₹{withdrawals.totalAmountWithdrawn.toLocaleString()}
            </div>
            <div className="small text-muted mt-1">
              {withdrawals.completed} Completed payouts
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Asset Balances Pool Breakdown */}
      <div
        className="p-4 mb-4"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <h5 className="fw-bold mb-3">Live Platform Asset Reserve Pool</h5>
        <div className="row g-3 text-center">
          <div className="col-6 col-md">
            <div className="p-3 bg-secondary-subtle rounded">
              <div className="small text-muted">Total VEs</div>
              <div className="fw-bold fs-5 text-warning">{balances.totalVes.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-6 col-md">
            <div className="p-3 bg-secondary-subtle rounded">
              <div className="small text-muted">Total SVEs</div>
              <div className="fw-bold fs-5 text-secondary">{balances.totalSves.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-6 col-md">
            <div className="p-3 bg-secondary-subtle rounded">
              <div className="small text-muted">Total Gems</div>
              <div className="fw-bold fs-5 text-info">{balances.totalGems.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-6 col-md">
            <div className="p-3 bg-secondary-subtle rounded">
              <div className="small text-muted">Total Tokens</div>
              <div className="fw-bold fs-5 text-primary">{balances.totalTokens.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-12 col-md">
            <div className="p-3 bg-secondary-subtle rounded">
              <div className="small text-muted">Total XP Earned</div>
              <div className="fw-bold fs-5 text-success">{balances.totalXp.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Security Audit Trail Preview */}
      <div
        className="p-4"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Recent Administrative Operations</h5>
          <Link to="/admin/audit-logs" className="small text-primary fw-semibold text-decoration-none">
            View All Audit Logs →
          </Link>
        </div>

        {recentAuditLogs && recentAuditLogs.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
              <thead className="table-light">
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Admin</th>
                  <th>Target</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {recentAuditLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="text-muted">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary font-monospace">
                        {log.action}
                      </span>
                    </td>
                    <td>{log.adminEmail}</td>
                    <td className="font-monospace fw-semibold">{log.targetIdentifier || 'N/A'}</td>
                    <td>{log.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted small mb-0">No recent administrative actions recorded.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
