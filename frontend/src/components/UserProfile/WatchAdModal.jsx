import React, { useState, useEffect } from 'react';
import { Video, CheckCircle2, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WatchAdModal = ({ isOpen, onClose, onRewardClaimed }) => {
  if (!isOpen) return null;

  const [timeLeft, setTimeLeft] = useState(5);
  const [completed, setCompleted] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCompleted(true);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      await onRewardClaimed();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
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
          className="modal-content border-0 text-center overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--card-shadow-hover)',
          }}
        >
          {/* Simulated Video Player Banner */}
          <div
            className="p-5 d-flex flex-column align-items-center justify-content-center position-relative"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
              color: 'white',
              minHeight: 220,
            }}
          >
            <div
              className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill small fw-bold"
              style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            >
              {completed ? 'Reward Ready!' : `Ad Playing: ${timeLeft}s`}
            </div>

            <div
              className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center"
              style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(6px)' }}
            >
              <Video size={40} color="#ffffff" />
            </div>

            <h4 className="fw-bold mb-1">VELoop Rewards Partner Showcase</h4>
            <p className="small mb-0" style={{ opacity: 0.85 }}>
              Discover innovative financial tools and earn guaranteed tokens.
            </p>

            {/* Video countdown bar */}
            <div
              className="position-absolute bottom-0 start-0 w-100"
              style={{ height: 6, background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((5 - timeLeft) / 5) * 100}%`,
                  background: '#10b981',
                  transition: 'width 1s linear',
                }}
              />
            </div>
          </div>

          <div className="p-4">
            <h5 className="fw-bold mb-2">
              {completed ? '🎉 Ad Finished!' : 'Please watch the brief sponsor message'}
            </h5>
            <p className="text-muted small mb-4">
              Reward: <strong>+30 VEs</strong>, <strong>+5 Gems</strong>, and <strong>+60 XP</strong>
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                disabled={!completed || claiming}
                onClick={handleClaim}
              >
                <Sparkles size={16} />
                {claiming ? 'Crediting...' : completed ? 'Claim Reward' : `Wait ${timeLeft}s`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchAdModal;
