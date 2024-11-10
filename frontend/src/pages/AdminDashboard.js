// frontend/src/pages/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { fetchAdminStats } from '../services/adminService';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Necessary for Chart.js

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTempData, setIsTempData] = useState(false); // Flag to indicate temporary data usage

  // Define Temporary (Mock) Data
  const temporaryData = {
    totalUsers: 150,
    totalServers: 75,
    activeServers: 70,
    premiumUsers: 25,
    freeUsers: 125,
    systemMetrics: {
      cpuUsage: '45%', // Mock CPU usage
      memoryUsage: '3.2 GB', // Mock Memory usage
      databaseSize: '200 MB', // Mock Database size
      uptime: '15 days, 8 hours', // Mock Uptime
    },
    userRegistrations: [
      { registration_day: '2024-10-12', users: 3 },
      { registration_day: '2024-10-13', users: 5 },
      { registration_day: '2024-10-14', users: 2 },
      { registration_day: '2024-10-15', users: 4 },
      { registration_day: '2024-10-16', users: 6 },
      // ... Add more mock data as needed
    ],
    recentSignups: [
      {
        id: 'user1',
        username: 'JaneDoe',
        discriminator: '5678',
        createdAt: '2024-11-10T18:30:00Z',
      },
      {
        id: 'user2',
        username: 'JohnSmith',
        discriminator: '1234',
        createdAt: '2024-11-10T17:45:00Z',
      },
      // ... Add more mock data as needed
    ],
  };

  const getStats = async () => {
    try {
      const response = await fetchAdminStats();
      console.log('Fetched Admin Stats:', response); // Debugging line
      if (
        response &&
        response.userRegistrations &&
        Array.isArray(response.userRegistrations)
      ) {
        setStats(response);
      } else {
        throw new Error('Incomplete data received from the server.');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.warn('Displaying temporary data due to data fetch issues.');
      setStats(temporaryData);
      setIsTempData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading Admin Dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center">No data available.</div>;
  }

  // Prepare data for charts
  const registrationChartData = {
    labels: stats.userRegistrations.map((reg) => reg.registration_day),
    datasets: [
      {
        label: 'User Registrations',
        data: stats.userRegistrations.map((reg) => reg.users),
        fill: false,
        backgroundColor: '#4ade80', // Tailwind's green-400
        borderColor: '#4ade80',
      },
    ],
  };

  return (
    <div
      className={`p-6 bg-base-100 rounded-lg shadow-md ${
        isTempData ? 'border-2 border-red-500' : ''
      }`}
    >
      {/* Notification Banner for Temporary Data */}
      {isTempData && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          <p>
            Displaying temporary data. Please check back later for updated
            statistics.
          </p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Servers" value={stats.totalServers} />
        <StatCard title="Active Servers" value={stats.activeServers} />
        <StatCard title="Premium Users" value={stats.premiumUsers} />
        <StatCard title="Free Users" value={stats.freeUsers} />
        <StatCard title="Database Size" value={stats.systemMetrics.databaseSize} />
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MetricCard title="CPU Usage" value={stats.systemMetrics.cpuUsage} />
        <MetricCard title="Memory Usage" value={stats.systemMetrics.memoryUsage} />
        <MetricCard title="Uptime" value={formatUptime(stats.systemMetrics.uptime)} />
      </div>

      {/* User Registrations Chart */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Registrations (Last 30 Days)</h2>
        {stats.userRegistrations && stats.userRegistrations.length > 0 ? (
          <Line data={registrationChartData} />
        ) : (
          <p>No user registration data available.</p>
        )}
      </div>
    </div>
  );
};

// Utility Components
const StatCard = ({ title, value }) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-2xl">{value}</p>
  </div>
);

const MetricCard = ({ title, value }) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-xl">{value}</p>
  </div>
);

// Utility function to format uptime
const formatUptime = (uptimeString) => {
  // Assuming uptimeString is already formatted, e.g., '15 days, 8 hours'
  return uptimeString;
};

export default AdminDashboard;
