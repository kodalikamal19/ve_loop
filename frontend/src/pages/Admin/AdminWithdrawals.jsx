import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminWithdrawals = () => {
  const { showToast } = useToast();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // Reject modal state
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getWithdrawals({ status: filter });
      if (res.success) {
        setWithdrawals(res.withdrawals || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch withdrawals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  const handleApprove = async (w) => {
    try {
      const res = await api.admin.updateWithdrawalStatus(w._id, {
        status: 'approved',
        note: 'Approved by administrator for payout dispatch.',
      });
      if (res.success) {
        showToast(`Withdrawal ${w.withdrawalId} marked as approved.`);
        fetchWithdrawals();
      }
    } catch (err) {
      showToast(err.message || 'Failed to approve withdrawal', 'error');
    }
  };

  const handleComplete = async (w) => {
    try {
      const res = await api.admin.updateWithdrawalStatus(w._id, {
        status: 'completed',
        note: 'Payout successfully disbursed and verified.',
      });
      if (res.success) {
        showToast(`Withdrawal ${w.withdrawalId} completed! Reserved balance deducted.`);
        fetchWithdrawals();
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete withdrawal', 'error');
    }
  };

  const handleOpenReject = (w) => {
    setSelectedWithdrawal(w);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleSubmitReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim() || rejectionReason.trim().length < 3) {
      showToast('Please provide a specific rejection reason.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.admin.updateWithdrawalStatus(selectedWithdrawal._id, {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
      });
      if (res.success) {
        showToast(`Withdrawal rejected. Reserved funds refunded to user's available balance.`);
        setRejectModalOpen(false);
        fetchWithdrawals();
      }
    } catch (err) {
      showToast(err.message || 'Failed to reject withdrawal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: 1240 }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">Withdrawal & Payout Management</h1>
          <p className="text-muted small mb-0">
            Review pending redemption requests, verify accounts, and authorize payouts.
          </p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div
        className="p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="btn-group btn-group-sm" role="group">
          {['ALL', 'pending', 'approved', 'completed', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              className={`btn ${filter === st ? 'btn-primary fw-bold' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(st)}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={fetchWithdrawals}
          className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-1"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Withdrawals Table */}
      <div
        className="table-responsive p-3"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
          <thead className="table-light">
            <tr>
              <th>Request ID</th>
              <th>User</th>
              <th>Points (VEs)</th>
              <th>Payout (INR)</th>
              <th>Payout Channel & Details</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Loading requests from database...
                </td>
              </tr>
            ) : withdrawals && withdrawals.length > 0 ? (
              withdrawals.map((w) => (
                <tr key={w._id}>
                  <td className="font-monospace fw-bold text-primary">{w.withdrawalId}</td>
                  <td>
                    <div className="fw-semibold">{w.userId?.displayName || w.userId?.name}</div>
                    <div className="text-muted small">{w.userId?.email}</div>
                  </td>
                  <td className="fw-bold">{w.amount.toLocaleString()} VEs</td>
                  <td className="fw-bold text-success fs-6">₹{w.fiatEquivalent.toLocaleString()}</td>
                  <td>
                    <span className="badge bg-light text-dark border me-1">{w.payoutMethod}</span>
                    <span className="small text-secondary font-monospace">
                      {w.payoutDetails?.upiId ||
                        w.payoutDetails?.accountNumber ||
                        w.payoutDetails?.giftCardEmail}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        w.status === 'completed'
                          ? 'bg-success text-white'
                          : w.status === 'approved'
                          ? 'bg-info text-dark'
                          : w.status === 'pending'
                          ? 'bg-warning text-dark'
                          : 'bg-danger text-white'
                      }`}
                    >
                      {w.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-end">
                    {w.status === 'pending' && (
                      <div className="btn-group btn-group-sm">
                        <button
                          onClick={() => handleApprove(w)}
                          className="btn btn-outline-primary"
                          title="Approve for payout"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleComplete(w)}
                          className="btn btn-outline-success"
                          title="Direct Complete"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleOpenReject(w)}
                          className="btn btn-outline-danger"
                          title="Reject and Refund"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {w.status === 'approved' && (
                      <button
                        onClick={() => handleComplete(w)}
                        className="btn btn-sm btn-success rounded-pill px-3 fw-semibold"
                      >
                        Mark Completed
                      </button>
                    )}
                    {['completed', 'rejected'].includes(w.status) && (
                      <span className="text-muted small">Finalized</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No withdrawal requests found for selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && selectedWithdrawal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Reject Withdrawal Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRejectModalOpen(false)}
                />
              </div>
              <form onSubmit={handleSubmitReject}>
                <div className="modal-body py-4">
                  <p className="small text-secondary mb-3">
                    Rejecting Request #{selectedWithdrawal.withdrawalId} for{' '}
                    <strong>{selectedWithdrawal.amount} VEs</strong> (₹{selectedWithdrawal.fiatEquivalent}).
                  </p>
                  <div className="alert alert-warning small py-2 mb-3">
                    Upon rejection, the reserved {selectedWithdrawal.amount} VEs will be immediately refunded back to the user's available wallet balance.
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-danger">
                      Mandatory Reason for Rejection
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g. Invalid UPI handle / KYC document mismatch"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-3"
                    onClick={() => setRejectModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger rounded-pill px-4 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? 'Rejecting...' : 'Confirm Rejection & Refund'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
