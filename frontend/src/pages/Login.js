// src/pages/Login.js

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If the user is already logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, redirect to Discord OAuth
      window.location.href = 'http://localhost:5000/api/auth/discord';
    }
  }, [user, navigate]);

  return <div>Redirecting to Discord...</div>;
};

export default Login;
