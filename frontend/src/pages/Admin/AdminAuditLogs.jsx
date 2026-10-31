import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Filter, RefreshCw, Key, DollarSign, UserX, FileCheck } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminAuditLogs = () => {
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getAuditLogs({
        page,
        limit: 15,
        action: actionFilter,
      });
      if (res.success) {
        setLogs(res.logs || []);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const getActionBadge = (action) => {
    switch (action) {
      case 'ADMIN_LOGIN':
        return <span className="badge bg-primary text-white">{action}</span>;
      case 'WALLET_ADJUSTMENT':
        return <span className="badge bg-warning text-dark">{action}</span>;
      case 'ACCOUNT_RESTRICTION':
        return <span className="badge bg-danger text-white">{action}</span>;
      case 'WITHDRAWAL_STATUS_CHANGE':
        return <span className="badge bg-success text-white">{action}</span>;
      default:
        return <span className="badge bg-secondary text-white">{action}</span>;
    }
  };

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: 1240 }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">System Security & Audit Logs</h1>
          <p className="text-muted small mb-0">
            Immutable administrative operation records ensuring full compliance and accountability.
          </p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter Bar */}
      <div
        className="p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <Filter size={16} className="text-muted" />
          <select
            className="form-select form-select-sm"
            style={{ minWidth: 220 }}
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All Actions</option>
            <option value="ADMIN_LOGIN">Admin Logins</option>
            <option value="WALLET_ADJUSTMENT">Wallet Adjustments</option>
            <option value="ACCOUNT_RESTRICTION">Account Restrictions</option>
            <option value="WITHDRAWAL_STATUS_CHANGE">Withdrawal Approvals/Rejections</option>
            <option value="LEVEL_CONFIG_UPDATE">Level Config Updates</option>
          </select>
        </div>

        <button
          onClick={fetchLogs}
          className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-1"
        >
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      {/* Audit Log Table */}
      <div
        className="table-responsive p-3"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
          <thead className="table-light">
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Admin Operator</th>
              <th>Target Identifier</th>
              <th>Operational Summary</th>
              <th>Audit Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Loading audit logs...
                </td>
              </tr>
            ) : logs && logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log._id}>
                  <td className="text-muted font-monospace small">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td>{getActionBadge(log.action)}</td>
                  <td className="fw-semibold">{log.adminEmail}</td>
                  <td className="font-monospace text-primary">{log.targetIdentifier || 'N/A'}</td>
                  <td>{log.summary}</td>
                  <td className="text-secondary small">{log.reason || 'Routine operation'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No audit logs found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <span className="small text-muted">Page {page} of {totalPages}</span>
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
