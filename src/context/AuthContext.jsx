import React, { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
const AUTH_STORAGE_KEY = 'hospital_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Unable to restore saved auth state:', error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check if logged in on mount
  useEffect(() => {
    fetch('http://localhost/Hospital/backend/api/auth.php?action=me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      })
      .catch((err) => console.error('Auth check fail:', err))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    fetch('http://localhost/Hospital/backend/api/auth.php?action=logout', {
      method: 'POST',
      credentials: 'include',
    })
      .finally(() => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
