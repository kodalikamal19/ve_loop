import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('veloop_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('veloop_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('veloop_token') || null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('veloop_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate user session on mount
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('veloop_user', JSON.stringify(res.user));
          }
        } catch {
          // Token invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('veloop_token');
          localStorage.removeItem('veloop_user');
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('veloop_token', authToken);
    localStorage.setItem('veloop_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('veloop_token');
    localStorage.removeItem('veloop_user');
  };

  const loginAdmin = (adminData, adminAuthToken) => {
    setAdminUser(adminData);
    setAdminToken(adminAuthToken);
    localStorage.setItem('veloop_admin_token', adminAuthToken);
    localStorage.setItem('veloop_admin_user', JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('veloop_admin_token');
    localStorage.removeItem('veloop_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loginUser,
        logoutUser,
        adminUser,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        loginAdmin,
        logoutAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
