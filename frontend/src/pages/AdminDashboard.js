// frontend/src/pages/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { fetchAdminStats } from '../services/adminService';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

// Import React Icons
import {
  FaUsers,
  FaServer,
  FaMicrochip,
  FaMemory,
  FaClock,
  FaDatabase,
  FaTerminal,
  FaChartPie,
} from 'react-icons/fa';

// Import Reusable Components
import StatCard from '../components/common/StatCard';
import MetricCard from '../components/common/MetricCard';
import CommandUsageCard from '../components/common/CommandUsageCard';
import ActivityPieChart from '../components/common/ActivityPieChart';
import CommandsLineChart from '../components/common/CommandsLineChart';
import GaugeCard from '../components/common/GaugeCard';
import RecentActivityList from '../components/common/RecentActivityList';
import Notifications from '../components/common/Notifications';
import Modal from '../components/common/Modal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTempData, setIsTempData] = useState(false); // Flag to indicate temporary data usage
  const [uptimeSeconds, setUptimeSeconds] = useState(0); // Frontend-side uptime
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Define Temporary (Mock) Data
  const temporaryData = {
    totalUsers: 150,
    totalServers: 75,
    premiumUsers: 25,
    freeUsers: 125,
    systemMetrics: {
      cpuUsage: '45%', // Mock CPU usage
      memoryUsage: '3.2 GB used / 8 GB total', // Mock Memory usage
      databaseSize: '200 MB',
      uptime: '15d 8h 30m 20s', // Mock Uptime
    },
    userRegistrations: [
      { id: 'reg1', registration_day: '2024-10-12', users: 3 },
      { id: 'reg2', registration_day: '2024-10-13', users: 5 },
      { id: 'reg3', registration_day: '2024-10-14', users: 2 },
      { id: 'reg4', registration_day: '2024-10-15', users: 4 },
      { id: 'reg5', registration_day: '2024-10-16', users: 6 },
      // ... Add more mock data as needed
    ],
    recentSignups: [
      {
        id: 'user1',
        type: 'user_signup',
        description: 'JaneDoe signed up.',
        timestamp: '2024-11-10T18:30:00Z',
      },
      {
        id: 'user2',
        type: 'user_signup',
        description: 'JohnSmith signed up.',
        timestamp: '2024-11-10T17:45:00Z',
      },
      // ... Add more mock data as needed
    ],
    notifications: [
      {
        id: 'note1',
        type: 'info',
        message: 'Server maintenance scheduled for tonight.',
        timestamp: '2024-11-10T16:00:00Z',
      },
      {
        id: 'note2',
        type: 'error',
        message: 'Database connection lost.',
        timestamp: '2024-11-10T15:30:00Z',
      },
      // ... Add more notifications as needed
    ],
    commandsUsedToday: 120, // New metric
    commandsUsageOverTime: [
      { hour: "00:00", commands: 5 },
      { hour: "01:00", commands: 3 },
      { hour: "02:00", commands: 2 },
      // ... continue up to "23:00"
      { hour: "23:00", commands: 4 },
    ],
    activitiesPerformedToday: [
      { id: "act1", name: "Login Attempts", value: 50 },
      { id: "act2", name: "Data Imports", value: 30 },
      { id: "act3", name: "User Management", value: 40 },
      // ... more activities
    ],
  };

  const getInitialStats = async () => {
    try {
      const response = await fetchAdminStats();
      console.log('Fetched Admin Stats:', response);

      const fetchedData = response.data;

      // Validate the response structure
      if (
        fetchedData &&
        fetchedData.userRegistrations &&
        Array.isArray(fetchedData.userRegistrations)
      ) {
        // Ensure 'recentSignups' and 'notifications' exist
        const recentSignups = fetchedData.recentSignups || [];
        const notifications = fetchedData.notifications || [];
        const commandsUsageOverTime = fetchedData.commandsUsageOverTime || temporaryData.commandsUsageOverTime;
        const activitiesPerformedToday = fetchedData.activitiesPerformedToday || temporaryData.activitiesPerformedToday;

        setStats({
          ...fetchedData,
          recentSignups,
          notifications,
          commandsUsageOverTime,
          activitiesPerformedToday,
        });

        // Initialize uptimeSeconds from fetched data
        const uptimeString = fetchedData.systemMetrics.uptime; // e.g., '15d 8h 30m 20s'
        const parsedSeconds = parseUptime(uptimeString);
        setUptimeSeconds(parsedSeconds);
      } else {
        throw new Error('Incomplete data received from the server.');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.warn('Displaying temporary data due to data fetch issues.');
      setStats(temporaryData);
      setIsTempData(true);

      // Initialize uptimeSeconds from temporary data
      const uptimeString = temporaryData.systemMetrics.uptime;
      const parsedSeconds = parseUptime(uptimeString);
      setUptimeSeconds(parsedSeconds);
    } finally {
      setLoading(false);
    }
  };

  // Function to parse uptime string to seconds
  const parseUptime = (uptimeStr) => {
    const regex = /(\d+)d\s+(\d+)h\s+(\d+)m\s+(\d+)s/;
    const match = uptimeStr.match(regex);
    if (match) {
      const days = parseInt(match[1], 10);
      const hours = parseInt(match[2], 10);
      const minutes = parseInt(match[3], 10);
      const seconds = parseInt(match[4], 10);
      return days * 86400 + hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  // Function to format seconds to 'Xd Xh Xm Xs'
  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d ${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    getInitialStats();

    // Initialize Socket.IO client
    const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
      withCredentials: true, // Send cookies with requests
      // If your backend requires auth tokens, include them here
      // auth: {
      //   token: 'YOUR_AUTH_TOKEN', // Implement authentication if required
      // },
    });

    // Listen for real-time updates
    socket.on('adminStatsUpdate', (updatedStats) => {
      console.log('Received real-time admin stats:', updatedStats);
      setStats(updatedStats);
      setIsTempData(false); // Since data is now live

      // Update uptimeSeconds based on the new uptime string
      const uptimeString = updatedStats.systemMetrics.uptime;
      const parsedSeconds = parseUptime(uptimeString);
      setUptimeSeconds(parsedSeconds);
    });

    // Handle socket connection errors
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      toast.error('Real-time updates unavailable.');
    });

    // Handle socket disconnection
    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // The server has forcefully disconnected the socket
        // Try to reconnect manually
        socket.connect();
      }
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('adminStatsUpdate');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Increment uptimeSeconds every second
    let timer;
    if (stats && !isTempData) {
      timer = setInterval(() => {
        setUptimeSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stats, isTempData]);

  // Functions to handle Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <div className="text-center">Loading Admin Dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center">No data available.</div>;
  }

  // Prepare data for user registrations chart (Recharts)
  const registrationChartData = stats.userRegistrations.map((reg) => ({
    registration_day: reg.registration_day,
    users: reg.users,
  }));

  // Prepare data for commands usage over time
  const commandsChartData = stats.commandsUsageOverTime.map((cmd) => ({
    hour: cmd.hour,
    commands: cmd.commands,
  }));

  // Prepare data for activity pie chart
  const activityPieData = stats.activitiesPerformedToday.map((activity) => ({
    name: activity.name,
    value: activity.value,
  }));

  return (
    <div
      className={`p-6 bg-base-100 rounded-lg shadow-md ${
        isTempData ? 'border-4 border-red-500' : ''
      }`}
    >
      {/* Notification Banner for Temporary Data */}
      {isTempData && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          <p>
            <strong>Temporary Data:</strong> Displaying mock data. Please check back later for updated
            statistics.
          </p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers />}
          color="green"
        />
        <StatCard
          title="Total Servers"
          value={stats.totalServers}
          icon={<FaServer />}
          color="blue"
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers}
          icon={<FaUsers />}
          color="teal"
        />
        <StatCard
          title="Free Users"
          value={stats.freeUsers}
          icon={<FaUsers />}
          color="indigo"
        />
        <StatCard
          title="Database Size"
          value={stats.systemMetrics.databaseSize}
          icon={<FaDatabase />}
          color="red"
        />
        <CommandUsageCard
          title="Commands Used Today"
          value={stats.commandsUsedToday}
          color="orange"
        />
      </div>

      {/* System Metrics with Interactive Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="CPU Usage"
          value={stats.systemMetrics.cpuUsage}
          icon={<FaMicrochip />}
          color="yellow"
        />
        <MetricCard
          title="Memory Usage"
          value={stats.systemMetrics.memoryUsage}
          icon={<FaMemory />}
          color="teal"
        />
        <GaugeCard
          title="Uptime"
          value={Math.floor(uptimeSeconds / 86400)} // Display uptime in days
          min={0}
          max={30} // Assuming a maximum of 30 days
          color="#f59e0b" // Tailwind yellow-500
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CommandsLineChart
          title="Commands Usage Over Time"
          data={commandsChartData}
        />
        <ActivityPieChart
          title="Activities Performed Today"
          data={activityPieData}
          colors={['#4ade80', '#f59e0b', '#f87171']} // Tailwind green-400, yellow-400, red-400
        />
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RecentActivityList activities={stats.recentSignups} />
        <Notifications notifications={stats.notifications} />
      </div>

      {/* Modal for Detailed Information (Optional) */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} title="Detailed Information">
        <p>More detailed metrics or settings can be displayed here.</p>
        {/* Add more components or information as needed */}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
