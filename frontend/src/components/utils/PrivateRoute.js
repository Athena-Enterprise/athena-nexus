// frontend/src/components/utils/PrivateRoute.js

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  if (!user) {
    // Redirect to Discord OAuth
    const redirectUri = encodeURIComponent('http://localhost:5000/api/auth/discord/callback');
    window.location.href = `https://discord.com/oauth2/authorize?client_id=1283070994965069878&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email%20guilds`;
    return null;
  }

  return <Outlet />;
};

export default PrivateRoute;
