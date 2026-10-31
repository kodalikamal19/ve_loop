import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Copy, ArrowRight, Lock, Key, Check } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { loginAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const demoEmail = 'demo-admin@veloop.io';
  const demoPassword = 'AdminDemo@2026';

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const handleAutoFill = () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    showToast('Demo admin credentials filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.admin.login({ email, password });
      if (res.success) {
        loginAdmin(res.admin, res.token);
        showToast(`Welcome, ${res.admin.name}!`);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Administrative authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ maxWidth: 500 }}>
      {/* Required Demo Credentials Panel per Section 30 */}
      <div
        className="p-4 mb-4 border border-primary-subtle"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-bold d-flex align-items-center gap-2 text-primary">
            <Key size={16} /> Demo Admin Access
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
            Evaluation Mode
          </span>
        </div>

        <p className="text-muted small mb-3">
          Use the pre-seeded Super Administrator credentials to access the administrative dashboard.
        </p>

        <div className="p-2 mb-2 bg-secondary-subtle rounded d-flex align-items-center justify-content-between font-monospace small">
          <span>Email: <strong>{demoEmail}</strong></span>
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-0 d-flex align-items-center gap-1"
            onClick={() => handleCopy(demoEmail, 'Email')}
          >
            <Copy size={13} /> Copy
          </button>
        </div>

        <div className="p-2 mb-3 bg-secondary-subtle rounded d-flex align-items-center justify-content-between font-monospace small">
          <span>Password: <strong>{demoPassword}</strong></span>
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-0 d-flex align-items-center gap-1"
            onClick={() => handleCopy(demoPassword, 'Password')}
          >
            <Copy size={13} /> Copy
          </button>
        </div>

        <button
          type="button"
          onClick={handleAutoFill}
          className="btn btn-primary btn-sm w-100 rounded-pill fw-semibold"
        >
          Autofill Demo Admin Credentials
        </button>
      </div>

      {/* Main Admin Login Card */}
      <div
        className="p-4 p-sm-5"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--card-shadow-hover)',
        }}
      >
        <div className="text-center mb-4">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
              color: 'white',
              boxShadow: '0 4px 14px rgba(67, 56, 202, 0.3)',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 className="fw-bold mb-1">Admin Portal</h2>
          <p className="text-muted small">
            Restricted access. All operations and logins are securely audited.
          </p>
        </div>

        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Admin Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@veloop.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Master Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 py-2 rounded-pill fw-semibold mt-3"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Authenticate as Admin'}
          </button>
        </form>

        <div className="text-center mt-4 pt-2">
          <Link
            to="/user-profile"
            className="text-muted small text-decoration-none"
          >
            ← Return to User Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
