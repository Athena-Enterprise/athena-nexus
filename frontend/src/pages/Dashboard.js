// frontend/src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { fetchServers, fetchServerStats } from '../services/serverService';

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [selectedServerStats, setSelectedServerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getServers = async () => {
      try {
        const data = await fetchServers();
        setServers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching servers:', err);
        setError('Failed to load servers.');
        setLoading(false);
      }
    };

    getServers();
  }, []);

  const handleServerClick = async (id) => {
    try {
      const stats = await fetchServerStats(id);
      setSelectedServerStats(stats);
    } catch (err) {
      console.error('Error fetching server stats:', err);
      setError('Failed to load server stats.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading servers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-40 container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Servers</h1>
      {servers.length === 0 ? (
        <div className="text-center text-lg">No servers found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map(server => (
            <div 
              key={server.id} 
              className="card bg-base-100 dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col justify-between"
            >
              <div className="flex items-center">
                <img 
                  src={server.iconUrl || 'https://via.placeholder.com/48'} 
                  alt={`${server.name} Icon`} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-1">{server.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">Members: {server.stats?.memberCount || 0}</p>
                  <p className="text-gray-600 dark:text-gray-300">Online: {server.stats?.onlineMembers || 0}</p>
                </div>
              </div>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={() => handleServerClick(server.id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedServerStats && (
        <div className="mt-10 bg-base-100 dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">Server Statistics</h2>
          <p className="text-lg">Member Count: {selectedServerStats.memberCount}</p>
          <p className="text-lg">Online Members: {selectedServerStats.onlineMembers}</p>
          {/* Add more stats as needed */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
