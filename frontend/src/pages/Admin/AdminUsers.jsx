import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShieldCheck, ShieldAlert, Edit, DollarSign, Eye, RefreshCw, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminUsers = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);

  // Form states for status change
  const [targetStatus, setTargetStatus] = useState('ACTIVE');
  const [statusReason, setStatusReason] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Form states for balance adjustment
  const [adjustAsset, setAdjustAsset] = useState('ves');
  const [adjustType, setAdjustType] = useState('credit');
  const [adjustAmount, setAdjustAmount] = useState('100');
  const [adjustReason, setAdjustReason] = useState('');
  const [submittingBalance, setSubmittingBalance] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getUsers({
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      if (res.success) {
        setUsers(res.users);
        setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleOpenStatusModal = (user) => {
    setSelectedUser(user);
    setTargetStatus(user.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
    setStatusReason('');
    setStatusModalOpen(true);
  };

  const handleOpenBalanceModal = (user) => {
    setSelectedUser(user);
    setAdjustAsset('ves');
    setAdjustType('credit');
    setAdjustAmount('100');
    setAdjustReason('');
    setBalanceModalOpen(true);
  };

  const handleOpenDetails = async (user) => {
    try {
      const res = await api.admin.getUserDetails(user._id);
      if (res.success) {
        setSelectedUser(res);
        setViewDetailsOpen(true);
      }
    } catch (err) {
      showToast('Could not load user details', 'error');
    }
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    if (!statusReason.trim() || statusReason.trim().length < 3) {
      showToast('Mandatory administrative reason required (min 3 chars).', 'error');
      return;
    }
    try {
      setSubmittingStatus(true);
      const res = await api.admin.updateUserStatus(selectedUser._id, {
        status: targetStatus,
        reason: statusReason.trim(),
      });
      if (res.success) {
        showToast(res.message);
        setStatusModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleSubmitBalance = async (e) => {
    e.preventDefault();
    const amt = Number(adjustAmount);
    if (!amt || amt <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }
    if (!adjustReason.trim() || adjustReason.trim().length < 4) {
      showToast('Detailed audit reason required (min 4 chars).', 'error');
      return;
    }
    try {
      setSubmittingBalance(true);
      const res = await api.admin.adjustBalance(selectedUser._id, {
        asset: adjustAsset,
        type: adjustType,
        amount: amt,
        reason: adjustReason.trim(),
      });
      if (res.success) {
        showToast(res.message);
        setBalanceModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message || 'Balance adjustment failed', 'error');
    } finally {
      setSubmittingBalance(false);
    }
  };

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: 1240 }}>
      {/* Breadcrumb & Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">User Account Management</h1>
          <p className="text-muted small mb-0">
            Search, inspect identities, manage access status, and conduct auditable adjustments.
          </p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="p-3 mb-4"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-secondary-subtle border-0">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name, Email, User ID (e.g. VLRUSR...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Account Statuses</option>
              <option value="ACTIVE">Active Accounts</option>
              <option value="SUSPENDED">Suspended Accounts</option>
              <option value="UNDER_REVIEW">Under Review</option>
            </select>
          </div>

          <div className="col-6 col-md-2">
            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-semibold">
              Search
            </button>
          </div>

          <div className="col-12 col-md-2 text-end">
            <button
              type="button"
              onClick={fetchUsers}
              className="btn btn-outline-secondary rounded-pill px-3 w-100 d-flex align-items-center justify-content-center gap-1"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
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
              <th>User ID</th>
              <th>Member Name & Email</th>
              <th>Tier Rank</th>
              <th>VEs Balance</th>
              <th>XP</th>
              <th>Status</th>
              <th className="text-end">Administrative Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  Loading users from database...
                </td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td className="font-monospace fw-bold text-primary">{u.userId}</td>
                  <td>
                    <div className="fw-semibold">{u.displayName || u.name}</div>
                    <div className="text-muted small">{u.email}</div>
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                      Level {u.level} — {u.levelName}
                    </span>
                  </td>
                  <td className="fw-bold">{u.balances?.ves?.toLocaleString() || 0} VEs</td>
                  <td className="fw-semibold text-secondary">{u.balances?.xp?.toLocaleString() || 0} XP</td>
                  <td>
                    <span
                      className={`badge ${
                        u.accountStatus === 'ACTIVE'
                          ? 'bg-success-subtle text-success border border-success-subtle'
                          : u.accountStatus === 'SUSPENDED'
                          ? 'bg-danger-subtle text-danger border border-danger-subtle'
                          : 'bg-warning-subtle text-warning border border-warning-subtle'
                      }`}
                    >
                      {u.accountStatus}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        onClick={() => handleOpenDetails(u)}
                        className="btn btn-outline-secondary"
                        title="View Full Profile Details"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleOpenBalanceModal(u)}
                        className="btn btn-outline-primary"
                        title="Adjust Wallet Balance (Auditable)"
                      >
                        <DollarSign size={14} /> Adjust
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal(u)}
                        className={`btn ${
                          u.accountStatus === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'
                        }`}
                        title="Change Account Status"
                      >
                        {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Restore'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No users found matching query.
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

      {/* Modal 1: Account Status Change (Suspend/Restore) */}
      {statusModalOpen && selectedUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Update Account Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setStatusModalOpen(false)}
                />
              </div>
              <form onSubmit={handleSubmitStatus}>
                <div className="modal-body py-4">
                  <p className="small text-secondary mb-3">
                    Modifying status for: <strong>{selectedUser.displayName || selectedUser.name}</strong> ({selectedUser.userId})
                  </p>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Status</label>
                    <select
                      className="form-select"
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                    >
                      <option value="ACTIVE">ACTIVE (Normal Access)</option>
                      <option value="SUSPENDED">SUSPENDED (Block access)</option>
                      <option value="UNDER_REVIEW">UNDER REVIEW (Restricted)</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-danger">
                      Administrative Audit Reason (Mandatory)
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g. Terms violation review / suspicious withdrawal pattern / ID verified"
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-3"
                    onClick={() => setStatusModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={submittingStatus}
                  >
                    {submittingStatus ? 'Saving...' : 'Confirm Status Change'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Auditable Balance Adjustment (Section 34) */}
      {balanceModalOpen && selectedUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Auditable Balance Adjustment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setBalanceModalOpen(false)}
                />
              </div>
              <form onSubmit={handleSubmitBalance}>
                <div className="modal-body py-4">
                  <div className="alert alert-info py-2 small mb-3">
                    Per Section 34, all adjustments are recorded in the system audit log and ledger with previous balance, new balance, acting admin, and mandatory reason.
                  </div>

                  <p className="small text-secondary mb-3">
                    User: <strong>{selectedUser.displayName || selectedUser.name}</strong> ({selectedUser.userId})
                  </p>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Asset</label>
                      <select
                        className="form-select"
                        value={adjustAsset}
                        onChange={(e) => setAdjustAsset(e.target.value)}
                      >
                        <option value="ves">VEs (Spendable)</option>
                        <option value="sves">SVEs (Silver)</option>
                        <option value="gems">Gems</option>
                        <option value="tokens">Tokens</option>
                        <option value="xp">XP (Progression)</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Action</label>
                      <select
                        className="form-select"
                        value={adjustType}
                        onChange={(e) => setAdjustType(e.target.value)}
                      >
                        <option value="credit">Credit (+ Add)</option>
                        <option value="debit">Debit (- Deduct)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Amount</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control font-monospace fw-bold"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-danger">
                      Administrative Audit Reason (Mandatory)
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="e.g. Compensatory credit for event participation / Manual adjustment"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-3"
                    onClick={() => setBalanceModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={submittingBalance}
                  >
                    {submittingBalance ? 'Executing...' : 'Execute Ledger Adjustment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: View Full User Details */}
      {viewDetailsOpen && selectedUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  User Profile Inspection: {selectedUser.user?.userId}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewDetailsOpen(false)}
                />
              </div>
              <div className="modal-body py-4">
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div className="p-3 bg-secondary-subtle rounded">
                      <div className="small text-muted">Full Name</div>
                      <div className="fw-bold">{selectedUser.user?.name}</div>
                      <div className="small text-muted mt-2">Email Address</div>
                      <div className="fw-semibold">{selectedUser.user?.email}</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 bg-secondary-subtle rounded">
                      <div className="small text-muted">Referral Code</div>
                      <div className="fw-bold font-monospace text-primary">
                        {selectedUser.user?.referralCode}
                      </div>
                      <div className="small text-muted mt-2">Account Health</div>
                      <span className="badge bg-success-subtle text-success">
                        {selectedUser.user?.accountStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">Live Wallet Balances</h6>
                <div className="row g-2 mb-4 text-center">
                  <div className="col"><div className="p-2 border rounded"><strong>{selectedUser.wallet?.ves || 0}</strong> VEs</div></div>
                  <div className="col"><div className="p-2 border rounded"><strong>{selectedUser.wallet?.sves || 0}</strong> SVEs</div></div>
                  <div className="col"><div className="p-2 border rounded"><strong>{selectedUser.wallet?.gems || 0}</strong> Gems</div></div>
                  <div className="col"><div className="p-2 border rounded"><strong>{selectedUser.wallet?.tokens || 0}</strong> Tokens</div></div>
                  <div className="col"><div className="p-2 border rounded"><strong>{selectedUser.wallet?.xp || 0}</strong> XP</div></div>
                </div>

                <h6 className="fw-bold mb-2">Recent Ledger Transactions ({selectedUser.transactions?.length || 0})</h6>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <table className="table table-sm small">
                    <thead>
                      <tr><th>Type</th><th>Asset</th><th>Amount</th><th>Reason</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {selectedUser.transactions?.map((t) => (
                        <tr key={t._id}>
                          <td><span className="badge bg-light text-dark">{t.type}</span></td>
                          <td>{t.asset?.toUpperCase()}</td>
                          <td>{t.amount}</td>
                          <td>{t.reason}</td>
                          <td>{t.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setViewDetailsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
