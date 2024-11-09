// frontend/src/components/ServerManagement.js

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ServerManagement = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await api.get('/admins/servers');
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error('Failed to fetch servers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Server Management</h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Server Name</th>
                <th>Server ID</th>
                <th>Member Count</th>
                <th>Premium Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id}>
                  <td>{server.name}</td>
                  <td>{server.id}</td>
                  <td>{server.memberCount}</td>
                  <td>{server.premium ? 'Premium' : 'Free'}</td>
                  <td>
                    {/* Implement server-specific actions */}
                    <button className="btn btn-sm btn-info">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServerManagement;
