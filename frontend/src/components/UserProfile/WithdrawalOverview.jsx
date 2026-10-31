import React from 'react';
import { ArrowUpRight, CheckCircle2, Clock, XCircle, Plus, AlertCircle } from 'lucide-react';
import styles from './WithdrawalOverview.module.css';

export const WithdrawalOverview = ({ withdrawalsSummary, recentWithdrawals = [], onOpenWithdraw }) => {
  const total = withdrawalsSummary?.totalRequests || 0;
  const pending = withdrawalsSummary?.pending || 0;
  const approved = withdrawalsSummary?.approved || 0;
  const rejected = withdrawalsSummary?.rejected || 0;
  const totalWithdrawn = withdrawalsSummary?.totalWithdrawn || 0;

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return (
          <span className={`${styles.statusBadge} ${styles.badgeApproved}`}>
            <CheckCircle2 size={12} /> {status}
          </span>
        );
      case 'pending':
        return (
          <span className={`${styles.statusBadge} ${styles.badgePending}`}>
            <Clock size={12} /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span className={`${styles.statusBadge} ${styles.badgeRejected}`}>
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Withdrawal Overview</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time payout ledger and processing history
          </span>
        </div>
        <button onClick={onOpenWithdraw} className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold d-flex align-items-center gap-1">
          <Plus size={16} /> Request Withdrawal
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryCardLabel}>Total Requests</span>
          <span className={styles.summaryCardValue}>{total}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryCardLabel}>Pending</span>
          <span className={`${styles.summaryCardValue} ${styles.statusPending}`}>{pending}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryCardLabel}>Approved</span>
          <span className={`${styles.summaryCardValue} ${styles.statusApproved}`}>{approved}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryCardLabel}>Rejected</span>
          <span className={`${styles.summaryCardValue} ${styles.statusRejected}`}>{rejected}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryCardLabel}>Total Withdrawn</span>
          <span className={`${styles.summaryCardValue} ${styles.statusCompleted}`}>
            ₹{totalWithdrawn.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      {recentWithdrawals && recentWithdrawals.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID / Reference</th>
                <th>Amount (VEs)</th>
                <th>Payout (INR)</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentWithdrawals.map((w) => (
                <tr key={w._id || w.withdrawalId}>
                  <td className="font-monospace fw-semibold">{w.withdrawalId}</td>
                  <td>{w.amount.toLocaleString()} VEs</td>
                  <td className="fw-bold text-success">₹{w.fiatEquivalent.toLocaleString()}</td>
                  <td>{w.payoutMethod}</td>
                  <td>
                    {renderStatusBadge(w.status)}
                    {w.rejectionReason && (
                      <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '2px' }}>
                        Note: {w.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(w.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="text-center py-4 px-3"
          style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}
        >
          <Clock size={36} color="var(--text-muted)" className="mb-2" />
          <h5 style={{ fontSize: '1rem', fontWeight: 600 }}>No Withdrawal History</h5>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 14px auto' }}>
            Your withdrawal activity will appear here when you submit a redemption request.
          </p>
          <button onClick={onOpenWithdraw} className="btn btn-outline-primary btn-sm rounded-pill px-3">
            Request Payout
          </button>
        </div>
      )}
    </div>
  );
};

export default WithdrawalOverview;
