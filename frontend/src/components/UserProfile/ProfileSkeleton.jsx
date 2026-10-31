import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div className="container py-4 animate-fade-in">
      {/* Hero Skeleton */}
      <div
        className="skeleton mb-4 p-4"
        style={{ height: '160px', borderRadius: 'var(--radius-xl)' }}
      />

      {/* Reward Assets Skeleton */}
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-12 col-sm-6 col-lg">
            <div
              className="skeleton"
              style={{ height: '170px', borderRadius: 'var(--radius-lg)' }}
            />
          </div>
        ))}
      </div>

      {/* Level Progress Skeleton */}
      <div
        className="skeleton mb-4"
        style={{ height: '180px', borderRadius: 'var(--radius-lg)' }}
      />

      {/* Grid of Withdrawals & Activity Skeleton */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div
            className="skeleton mb-4"
            style={{ height: '240px', borderRadius: 'var(--radius-lg)' }}
          />
        </div>
        <div className="col-12 col-lg-4">
          <div
            className="skeleton mb-4"
            style={{ height: '240px', borderRadius: 'var(--radius-lg)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
