import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, ShieldCheck, LogOut, User, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, isAuthenticated, logoutUser, isAdminAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className={styles.navHeader}>
      <div className="container py-2 d-flex align-items-center justify-content-between">
        <Link to="/user-profile" className={styles.brandLogo}>
          <div className={styles.brandIcon}>
            <Gift size={20} />
          </div>
          <span>VELoop</span>
          <span className={styles.brandTag}>Rewards</span>
        </Link>

        <nav className={styles.navLinks}>
          <NavLink
            to="/user-profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <User size={16} />
            <span className="d-none d-sm-inline">Profile Command</span>
          </NavLink>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <ShieldCheck size={16} />
            <span className="d-none d-sm-inline">Admin Panel</span>
          </NavLink>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme mode"
          >
            {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* User state badge */}
          {isAuthenticated && user ? (
            <div className={styles.userBadge}>
              <div className={styles.avatarMini}>
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.displayName || user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (user.displayName || user.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <span className={`${styles.userName} d-none d-md-inline`}>
                {user.displayName || user.name}
              </span>
              <button
                onClick={handleLogout}
                className={styles.logoutBtn}
                title="Log Out"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary px-3 rounded-pill fw-semibold">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
