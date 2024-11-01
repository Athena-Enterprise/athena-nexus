// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/me', { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, fetchUser }}>{children}</AuthContext.Provider>;
};
