import React, { useState } from 'react';
import { Send, AlertCircle, Info, Landmark, Smartphone, Gift } from 'lucide-react';

export const WithdrawalModal = ({ availableVes = 0, isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('400');
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [giftCardEmail, setGiftCardEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const numAmount = Number(amount) || 0;
  const fiatEquivalent = Math.round(numAmount * 0.5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numAmount < 200) {
      setError('Minimum withdrawal amount is 200 VEs (₹100).');
      return;
    }
    if (numAmount > availableVes) {
      setError(`Insufficient VEs. You only have ${availableVes.toLocaleString()} VEs available.`);
      return;
    }

    if (payoutMethod === 'UPI' && !upiId.trim()) {
      setError('Please provide a valid UPI ID (e.g. yourname@oksbi).');
      return;
    }

    if (payoutMethod === 'Bank Transfer' && (!accountNumber.trim() || !ifscCode.trim())) {
      setError('Please enter Bank Account Number and IFSC Code.');
      return;
    }

    if (payoutMethod === 'Amazon Gift Card' && !giftCardEmail.trim()) {
      setError('Please enter your email for receiving the Gift Card.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({
        amount: numAmount,
        payoutMethod,
        upiId: upiId.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        accountHolderName: accountHolderName.trim(),
        giftCardEmail: giftCardEmail.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit withdrawal request.');
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
            <h5 className="modal-title fw-bold">Redeem Payout / Withdrawal</h5>
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
                style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}
              >
                <div>
                  <div className="small text-muted">Available to Redeem:</div>
                  <div className="fw-bold fs-5 text-primary">{availableVes.toLocaleString()} VEs</div>
                </div>
                <div className="text-end">
                  <div className="small text-muted">Estimated Payout:</div>
                  <div className="fw-bold fs-5 text-success">₹{fiatEquivalent.toLocaleString()}</div>
                </div>
              </div>

              {/* Amount input */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Withdrawal Amount (VEs) — Min: 200 VEs
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    min="200"
                    max={availableVes}
                    step="50"
                    className="form-control font-monospace fw-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setAmount(String(availableVes))}
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Payout method tabs */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Payout Channel</label>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${payoutMethod === 'UPI' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setPayoutMethod('UPI')}
                  >
                    <Smartphone size={14} className="me-1" /> UPI
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${payoutMethod === 'Bank Transfer' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setPayoutMethod('Bank Transfer')}
                  >
                    <Landmark size={14} className="me-1" /> Bank
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${payoutMethod === 'Amazon Gift Card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setPayoutMethod('Amazon Gift Card')}
                  >
                    <Gift size={14} className="me-1" /> Voucher
                  </button>
                </div>
              </div>

              {/* Dynamic details input */}
              {payoutMethod === 'UPI' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">UPI VPA ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. mobile@paytm or name@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}

              {payoutMethod === 'Bank Transfer' && (
                <>
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-secondary">Account Holder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Account holder legal name"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-7">
                      <label className="form-label fw-semibold small text-secondary">Account Number</label>
                      <input
                        type="text"
                        className="form-control font-monospace"
                        placeholder="Account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-5">
                      <label className="form-label fw-semibold small text-secondary">IFSC Code</label>
                      <input
                        type="text"
                        className="form-control font-monospace text-uppercase"
                        placeholder="HDFC0001234"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {payoutMethod === 'Amazon Gift Card' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Gift Card Delivery Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={giftCardEmail}
                    onChange={(e) => setGiftCardEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="d-flex align-items-center gap-2 p-2 bg-warning-subtle text-warning-emphasis rounded small">
                <Info size={16} className="flex-shrink-0" />
                <span>Submitted VEs will be reserved in your wallet until approved and paid out.</span>
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
                {submitting ? 'Reserving...' : `Submit Request (₹${fiatEquivalent})`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;
