// frontend/src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me');
        if (isMounted) {
          setUser(response.data); // Ensure response.data includes isAdmin
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        if (isMounted) {
          setUser(null);
          setAuthError(error.response?.data || 'Failed to authenticate user.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateUser = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      setAuthError(error.response?.data || 'Failed to logout.');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      setUser(response.data);
      setAuthError(null);
    } catch (error) {
      console.error('Error logging in:', error);
      setAuthError(error.response?.data || 'Failed to login.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
        login,
        loading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
