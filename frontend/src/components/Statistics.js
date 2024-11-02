// frontend/src/components/Statistics.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/admins/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Failed to fetch statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center">No statistics available.</div>;
  }

  return (
    <div className="pt-20 card shadow-lg p-6 bg-base-100">
      <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat">
          <div className="stat-title">Total Servers</div>
          <div className="stat-value">{stats.totalServers}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Premium Users</div>
          <div className="stat-value">{stats.premiumUsers}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Free Users</div>
          <div className="stat-value">{stats.freeUsers}</div>
        </div>
        {/* Add more stat cards as needed */}
      </div>
    </div>
  );
};

export default Statistics;
