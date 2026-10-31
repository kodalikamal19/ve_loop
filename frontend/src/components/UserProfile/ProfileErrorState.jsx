import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ProfileErrorState = ({ message, onRetry }) => {
  return (
    <div className="container py-5 text-center animate-fade-in">
      <div
        className="mx-auto p-5"
        style={{
          maxWidth: 520,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
          }}
        >
          <AlertCircle size={32} />
        </div>

        <h3 className="fw-bold mb-2">Unable to Load Profile</h3>
        <p className="text-secondary mb-4" style={{ fontSize: '0.92rem' }}>
          {message || "We couldn't load your profile information right now. Please check your network connection and try again."}
        </p>

        <button
          onClick={onRetry}
          className="btn btn-primary px-4 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
};

export default ProfileErrorState;
