import React, { useState } from 'react';
import { RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

export const ConvertSvesModal = ({ availableSves = 0, isOpen, onClose, onConvert }) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('100');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const numAmount = Number(amount) || 0;
  const convertedVes = Math.floor(numAmount * 1.2);
  const xpBonus = Math.floor(numAmount * 0.5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numAmount < 10) {
      setError('Minimum conversion is 10 SVEs.');
      return;
    }
    if (numAmount > availableSves) {
      setError(`You only have ${availableSves} SVEs available.`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onConvert(numAmount);
      onClose();
    } catch (err) {
      setError(err.message || 'Conversion failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        overflowY: 'auto',
      }}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--card-shadow-hover)',
          }}
        >
          <div className="modal-header border-bottom border-light-subtle pb-3">
            <h5 className="modal-title fw-bold">Convert Silver (SVEs) to VEs</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-4">
              {error && <div className="alert alert-danger py-2 mb-3 small">{error}</div>}

              <div
                className="p-3 mb-3 d-flex justify-content-between align-items-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(203, 213, 225, 0.1) 100%)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #cbd5e1',
                }}
              >
                <div>
                  <div className="small text-muted">Available SVEs:</div>
                  <div className="fw-bold fs-5 text-secondary">{availableSves.toLocaleString()} SVEs</div>
                </div>
                <div className="text-end">
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                    1.2x Multiplier Bonus!
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  SVEs Amount to Exchange
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    min="10"
                    max={availableSves}
                    step="10"
                    className="form-control font-monospace fw-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setAmount(String(availableSves))}
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Conversion Preview Box */}
              <div
                className="p-3 text-center my-3"
                style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}
              >
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div>
                    <div className="fw-bold text-secondary fs-5">{numAmount} SVEs</div>
                    <div className="small text-muted">Converted</div>
                  </div>
                  <ArrowRight size={22} color="#6366f1" />
                  <div>
                    <div className="fw-bold text-primary fs-5">+{convertedVes} VEs</div>
                    <div className="small text-muted">Credited to Balance</div>
                  </div>
                </div>
                <div className="mt-2 small text-success fw-semibold d-flex align-items-center justify-content-center gap-1">
                  <Sparkles size={14} /> Includes +{xpBonus} Bonus XP boost!
                </div>
              </div>
            </div>

            <div className="modal-footer border-top border-light-subtle pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-semibold"
                disabled={submitting}
              >
                {submitting ? 'Converting...' : 'Confirm Exchange'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConvertSvesModal;
