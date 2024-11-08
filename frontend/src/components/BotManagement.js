// frontend/src/components/BotManagement.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const BotManagement = () => {
  const [commands, setCommands] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommands();
    fetchFeatures();
  }, []);

  const fetchCommands = async () => {
    try {
      const response = await api.get('/api/commands');
      setCommands(response.data);
    } catch (error) {
      console.error('Error fetching commands:', error);
      toast.error('Failed to fetch commands.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await api.get('/api/features');
      setFeatures(response.data);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to fetch features.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/commands/${id}`, { status: newStatus });
      setCommands((prevCommands) =>
        prevCommands.map((cmd) => (cmd.id === id ? { ...cmd, status: newStatus } : cmd))
      );
      toast.success('Command status updated successfully.');
    } catch (error) {
      console.error('Error changing command status:', error);
      toast.error('Failed to update command status.');
    }
  };

  const handleTierChange = async (id, newTier) => {
    try {
      await api.put(`/api/commands/${id}`, { tier: newTier });
      setCommands((prevCommands) =>
        prevCommands.map((cmd) => (cmd.id === id ? { ...cmd, tier: newTier } : cmd))
      );
      toast.success('Command tier updated successfully.');
    } catch (error) {
      console.error('Error updating command tier:', error);
      toast.error('Failed to update command tier.');
    }
  };

  const handleFeatureChange = async (id, newFeatureId) => {
    try {
      await api.put(`/api/commands/${id}`, { featureId: newFeatureId });
      setCommands((prevCommands) =>
        prevCommands.map((cmd) => (cmd.id === id ? { ...cmd, featureId: newFeatureId } : cmd))
      );
      toast.success('Command feature updated successfully.');
    } catch (error) {
      console.error('Error updating command feature:', error);
      toast.error('Failed to update command feature.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading commands...</div>;
  }

  if (!commands.length) {
    return <div className="text-center">No commands available.</div>;
  }

  return (
    <div className="pt-20 card shadow-lg p-6 bg-base-100">
      <h2 className="text-2xl font-semibold mb-4">Bot Management</h2>
      <div className="mb-4">
        <Link to="/admin/commands" className="btn btn-primary">
          Add New Command
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Premium Only</th>
              <th>Feature</th>
              <th>Status</th>
              <th>Tier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commands.map((cmd) => (
              <tr key={cmd.id}>
                <td>{cmd.name}</td>
                <td>{cmd.description}</td>
                <td>{cmd.premiumOnly ? 'Yes' : 'No'}</td>
                <td>
                  <select
                    value={cmd.featureId}
                    onChange={(e) => handleFeatureChange(cmd.id, e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    <option value="">Select Feature</option>
                    {features.map((feature) => (
                      <option key={feature.id} value={feature.id}>
                        {feature.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={cmd.status}
                    onChange={(e) => handleStatusChange(cmd.id, e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    <option value="development">Development</option>
                    <option value="active">Active</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </td>
                <td>
                  <select
                    value={cmd.tier}
                    onChange={(e) => handleTierChange(cmd.id, e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    <option value="free">Free</option>
                    <option value="community">Community</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </td>
                <td>
                  <Link to={`/admin/commands/${cmd.id}/edit`} className="btn btn-sm btn-info">
                    Edit
                  </Link>
                  {/* Implement the edit functionality as needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BotManagement;
