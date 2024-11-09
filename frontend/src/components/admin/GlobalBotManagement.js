// frontend/src/components/admin/GlobalBotManagement.js

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaSync, FaStop, FaEdit } from 'react-icons/fa';

const GlobalBotManagement = () => {
  const [botStatus, setBotStatus] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: '',
    name: '',
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [botDetails, setBotDetails] = useState({
    name: '',
    avatarUrl: '',
  });

  useEffect(() => {
    fetchBotStatus();
    fetchBotDetails();
  }, []);

  const fetchBotStatus = async () => {
    try {
      const response = await api.get('/admin/bot/status');
      setBotStatus(response.data);
    } catch (error) {
      console.error('Error fetching bot status:', error);
      toast.error('Failed to fetch bot status.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBotDetails = async () => {
    try {
      const response = await api.get('/admin/bot/details');
      setBotDetails({
        name: response.data.name,
        avatarUrl: response.data.avatarUrl,
      });
    } catch (error) {
      console.error('Error fetching bot details:', error);
      toast.error('Failed to fetch bot details.');
    }
  };

  const handleRestartBot = async () => {
    if (!window.confirm('Are you sure you want to restart the bot?')) return;
    try {
      await api.post('/admin/bot/restart');
      toast.success('Bot is restarting...');
      // Optionally, poll for status updates
    } catch (error) {
      console.error('Error restarting bot:', error);
      toast.error('Failed to restart the bot.');
    }
  };

  const handleStopBot = async () => {
    if (!window.confirm('Are you sure you want to stop the bot?')) return;
    try {
      await api.post('/admin/bot/stop');
      toast.success('Bot has been stopped.');
      // Optionally, update status
      setBotStatus({ ...botStatus, uptime: 'Stopped', cpuUsage: 0, memoryUsage: 0 });
    } catch (error) {
      console.error('Error stopping bot:', error);
      toast.error('Failed to stop the bot.');
    }
  };

  const handleEditBotDetails = () => {
    setEditing(true);
  };

  const handleSaveBotDetails = async () => {
    const { name, avatarUrl } = botDetails;
    if (!name) {
      toast.warn('Bot name cannot be empty.');
      return;
    }
    try {
      await api.put('/admin/bot/details', { name, avatarUrl });
      toast.success('Bot details updated successfully.');
      setEditing(false);
    } catch (error) {
      console.error('Error updating bot details:', error);
      toast.error('Failed to update bot details.');
    }
  };

  if (loading) {
    return <div>Loading Bot Management...</div>;
  }

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Global Bot Management</h2>

      {/* Bot Status */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Bot Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary text-secondary-content rounded-lg">
            <p><strong>CPU Usage:</strong> {botStatus.cpuUsage}%</p>
            <p><strong>Memory Usage:</strong> {botStatus.memoryUsage}MB</p>
            <p><strong>Uptime:</strong> {botStatus.uptime}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleRestartBot}
              className="btn btn-warning flex items-center"
            >
              <FaSync className="mr-2" /> Restart Bot
            </button>
            <button
              onClick={handleStopBot}
              className="btn btn-error flex items-center"
            >
              <FaStop className="mr-2" /> Stop Bot
            </button>
          </div>
        </div>
      </div>

      {/* Bot Details */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Bot Details</h3>
        <div className="flex items-center space-x-4">
          <img
            src={botDetails.avatarUrl || 'https://via.placeholder.com/100'}
            alt="Bot Avatar"
            className="w-20 h-20 rounded-full border-2 border-gray-700"
          />
          <div>
            <p><strong>Name:</strong> {botDetails.name}</p>
            {!editing && (
              <button
                onClick={handleEditBotDetails}
                className="btn btn-sm btn-info mt-2 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Details
              </button>
            )}
          </div>
        </div>

        {/* Edit Bot Details Form */}
        {editing && (
          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Bot Name"
              value={botDetails.name}
              onChange={(e) => setBotDetails({ ...botDetails, name: e.target.value })}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Avatar URL"
              value={botDetails.avatarUrl}
              onChange={(e) => setBotDetails({ ...botDetails, avatarUrl: e.target.value })}
              className="input input-bordered w-full"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleSaveBotDetails}
                className="btn btn-primary"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalBotManagement;
