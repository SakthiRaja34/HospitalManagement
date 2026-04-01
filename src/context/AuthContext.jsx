import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
        }
      })
      .catch((err) => console.error('Auth check fail:', err))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    fetch('http://localhost/Hospital/backend/api/auth.php?action=logout', {
      method: 'POST',
      credentials: 'include',
    })
      .finally(() => {
        setUser(null);
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
