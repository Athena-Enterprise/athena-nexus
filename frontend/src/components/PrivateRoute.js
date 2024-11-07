// src/components/PrivateRoute.js

import React from 'react';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    // Redirect to Discord OAuth with actual client ID and redirect URI
    const redirectUri = encodeURIComponent('http://localhost:5000/api/auth/discord/callback');
    window.location.href = `https://discord.com/oauth2/authorize?client_id=1283070994965069878&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email%20guilds`;
    return null;
  }

  return children;
};

export default PrivateRoute;
