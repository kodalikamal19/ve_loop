import React, { useState } from 'react';
import { X, Check, User, FileText, Image } from 'lucide-react';

export const EditProfileModal = ({ profile, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [displayName, setDisplayName] = useState(profile?.displayName || profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [profileImage, setProfileImage] = useState(profile?.profileImage || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSave({ displayName: displayName.trim(), bio: bio.trim(), profileImage: profileImage.trim() });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
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
            <h5 className="modal-title fw-bold">Edit Profile</h5>
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
              {error && <div className="alert alert-danger py-2 mb-3 font-size-sm">{error}</div>}

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Display Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary-subtle border-0">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your public name"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Profile Avatar Image URL (Optional)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary-subtle border-0">
                    <Image size={16} />
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Bio / Rewards Goal
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short note about yourself"
                  maxLength={300}
                />
                <div className="text-end text-muted small mt-1">{bio.length}/300</div>
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
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
