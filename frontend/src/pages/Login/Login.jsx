import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Gift, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { loginUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFillDemoUser = () => {
    setIsRegister(false);
    setEmail('demo-user@veloop.io');
    setPassword('UserDemo@2026');
    setError('');
    showToast('Loaded demo user credentials!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        const res = await api.auth.register({ name, email, password, referralCode });
        if (res.success) {
          loginUser(res.user, res.token);
          showToast('Welcome to VELoop Rewards!');
          navigate('/user-profile');
        }
      } else {
        const res = await api.auth.login({ email, password });
        if (res.success) {
          loginUser(res.user, res.token);
          showToast('Signed in successfully!');
          navigate('/user-profile');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ maxWidth: 480 }}>
      {/* Demo Credentials Box */}
      <div
        className="p-3 mb-4 d-flex align-items-center justify-content-between"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div>
          <div className="fw-bold small d-flex align-items-center gap-1 text-primary">
            <Sparkles size={14} /> Evaluation Demo Mode
          </div>
          <div className="text-muted" style={{ fontSize: '0.78rem' }}>
            demo-user@veloop.io
          </div>
        </div>
        <button
          onClick={handleFillDemoUser}
          className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
        >
          Autofill Demo User
        </button>
      </div>

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
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Gift size={26} />
          </div>
          <h2 className="fw-bold mb-1">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-muted small">
            {isRegister
              ? 'Join VELoop Rewards to earn points, gems and prizes'
              : 'Sign in to access your personal rewards command center'}
          </p>
        </div>

        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                className="form-control text-uppercase font-monospace"
                placeholder="VELOOP123"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-pill fw-semibold mt-3"
            disabled={submitting}
          >
            {submitting ? 'Please wait...' : isRegister ? 'Register & Start Earning' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-light-subtle small">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                className="btn btn-link p-0 fw-semibold text-decoration-none"
                onClick={() => setIsRegister(false)}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                className="btn btn-link p-0 fw-semibold text-decoration-none"
                onClick={() => setIsRegister(true)}
              >
                Create One
              </button>
            </span>
          )}
        </div>

        <div className="text-center mt-3 pt-2">
          <Link
            to="/admin/login"
            className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1"
          >
            <ShieldCheck size={14} /> Go to Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
