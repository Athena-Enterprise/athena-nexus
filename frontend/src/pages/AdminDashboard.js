// frontend/src/pages/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaServer, FaCogs, FaRobot } from 'react-icons/fa';
import StatCard from '../components/common/StatCard';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const {
    data: stats,
    loading,
    error,
  } = useFetch('/admin/stats');

  // Debugging: Log the fetched stats
  console.log('Fetched Admin Stats:', stats);

  if (loading) {
    return <div className="text-center">Loading Admin Dashboard...</div>;
  }

  if (error) {
    toast.error('Failed to load admin statistics.');
    return <div className="text-center text-error">Error loading dashboard.</div>;
  }

  if (!stats) {
    toast.error('No statistics data available.');
    return <div className="text-center">No data available.</div>;
  }

  // Optional: Check if expected properties exist
  const { totalUsers, totalServers, activeFeatures } = stats;

  if (
    totalUsers === undefined ||
    totalServers === undefined ||
    activeFeatures === undefined
  ) {
    toast.error('Incomplete statistics data received.');
    return <div className="text-center">Incomplete data available.</div>;
  }

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<FaUsers />}
          color="primary"
        />
        <StatCard
          title="Total Servers"
          value={totalServers}
          icon={<FaServer />}
          color="secondary"
        />
        <StatCard
          title="Active Features"
          value={activeFeatures}
          icon={<FaCogs />}
          color="accent"
        />
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/user-management" className="card bg-base-200 shadow-xl flex items-center p-4">
          <FaUsers className="text-4xl mr-4 text-primary" />
          <div>
            <h2 className="card-title">User Management</h2>
            <p>Manage users and their roles.</p>
          </div>
        </Link>
        <Link to="/admin/server-management" className="card bg-base-200 shadow-xl flex items-center p-4">
          <FaServer className="text-4xl mr-4 text-secondary" />
          <div>
            <h2 className="card-title">Server Management</h2>
            <p>Manage server settings and configurations.</p>
          </div>
        </Link>
        <Link to="/admin/command-feature-management" className="card bg-base-200 shadow-xl flex items-center p-4">
          <FaCogs className="text-4xl mr-4 text-accent" />
          <div>
            <h2 className="card-title">Command & Feature Management</h2>
            <p>Create and manage bot commands and features.</p>
          </div>
        </Link>
        <Link to="/admin/bot-management" className="card bg-base-200 shadow-xl flex items-center p-4">
          <FaRobot className="text-4xl mr-4 text-info" />
          <div>
            <h2 className="card-title">Bot Management</h2>
            <p>Control global bot settings and operations.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
