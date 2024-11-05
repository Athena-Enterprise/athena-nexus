// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component that wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [servers, setServers] = useState([]);
  const [selectedServerId, setSelectedServerId] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/users/me', { withCredentials: true }); // Use relative path
      console.log('User Data:', res.data); // Debugging line
      setUser(res.data);
      setServers(res.data.servers || []);
      setSelectedServerId(res.data.servers && res.data.servers.length > 0 ? res.data.servers[0].id : null);
      console.log('Servers:', res.data.servers);
      console.log('Selected Server ID:', res.data.servers && res.data.servers.length > 0 ? res.data.servers[0].id : null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setServers([]);
      setSelectedServerId(null);
      toast.error('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, servers, selectedServerId, setSelectedServerId, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
