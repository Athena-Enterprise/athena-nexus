// frontend/src/components/AdminRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user === undefined) {
    // Authentication status is unknown, show a loading indicator
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
      </div>
    );
  }

  if (!user) {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    // User is authenticated but not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and is an admin
  return children;
};

export default AdminRoute;
