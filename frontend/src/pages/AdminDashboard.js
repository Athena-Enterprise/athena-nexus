// frontend/src/pages/AdminDashboard.js

import React from 'react';
import useFetch from '../hooks/useFetch';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FaUsers, FaServer, FaUserShield, FaUser, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  const { data: stats, loading, error } = useFetch('/api/admins/statistics');

  if (loading) {
    return <div>Loading Admin Dashboard...</div>;
  }

  if (error) {
    return <div>Error loading admin dashboard.</div>;
  }

  if (!stats) {
    return <div>No data available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-base-100 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of the platform's performance.
        </p>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-base-100 p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-primary rounded-full text-white">
            <FaUsers className="text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{stats.totalUsers}</p>
            <p className="text-gray-600">Total Users</p>
          </div>
        </div>
        <div className="bg-base-100 p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-secondary rounded-full text-white">
            <FaServer className="text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{stats.totalServers}</p>
            <p className="text-gray-600">Total Servers</p>
          </div>
        </div>
        <div className="bg-base-100 p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-accent rounded-full text-white">
            <FaUserShield className="text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{stats.premiumUsers}</p>
            <p className="text-gray-600">Premium Users</p>
          </div>
        </div>
        <div className="bg-base-100 p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-info rounded-full text-white">
            <FaUser className="text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{stats.freeUsers}</p>
            <p className="text-gray-600">Free Users</p>
          </div>
        </div>
      </div>

      {/* User Registrations Chart */}
      <div className="bg-base-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">User Registrations</h2>
        {stats.userRegistrations && stats.userRegistrations.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.userRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="users" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No user registration data available.</p>
        )}
      </div>

      {/* Recent User Signups */}
      <div className="bg-base-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Recent User Signups</h2>
        {stats.recentSignups && stats.recentSignups.length > 0 ? (
          <ul className="space-y-2">
            {stats.recentSignups.map((user) => (
              <li key={user.id} className="flex items-center">
                <FaUser className="text-lg text-primary mr-2" />
                <span>{user.username}#{user.discriminator}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent signups available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
