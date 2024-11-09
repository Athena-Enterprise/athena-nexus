// frontend/src/pages/Dashboard.js

import React, { useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FaServer, FaUsers, FaChartLine, FaCircle } from 'react-icons/fa';

const Dashboard = () => {
  const { data: stats, loading, error } = useFetch('/users/me/stats');

  useEffect(() => {
    console.log('Dashboard component rendered.');
    console.log('Stats:', stats);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [stats, loading, error]);

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-error">Error loading dashboard.</div>;
  }

  if (!stats) {
    return <div className="text-center">No data available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-base-100 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-semibold">Welcome back, {stats.username}!</h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your servers today.
        </p>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-base-100 p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-primary rounded-full text-white">
            <FaServer className="text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{stats.totalServers}</p>
            <p className="text-gray-600">Your Servers</p>
          </div>
        </div>
        <div className="bg-base-100 p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-secondary rounded-full text-white">
            <FaUsers className="text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{stats.totalMembers}</p>
            <p className="text-gray-600">Total Members</p>
          </div>
        </div>
        <div className="bg-base-100 p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-accent rounded-full text-white">
            <FaChartLine className="text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{stats.activeMembers}</p>
            <p className="text-gray-600">Active Members</p>
          </div>
        </div>
      </div>

      {/* Member Growth Chart */}
      <div className="bg-base-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Member Growth Over Time</h2>
        {stats.memberGrowth && stats.memberGrowth.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="members" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No member growth data available.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-base-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          <ul className="space-y-2">
            {stats.recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center">
                <FaCircle className="text-xs text-green-500 mr-2" />
                <span>{activity.description}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {new Date(activity.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activity available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
