// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const toggleAdminMode = () => {
    setIsAdminMode(prevMode => !prevMode);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/users/me', { withCredentials: true });
        setUser(response.data);
        setIsAdminMode(response.data.isAdmin); // Initialize isAdminMode based on user's admin status
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setIsAdminMode(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAdminMode, toggleAdminMode, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
