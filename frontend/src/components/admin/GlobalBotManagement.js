// frontend/src/components/admin/GlobalBotManagement.js

import React, { useEffect, useState } from 'react';
import {
  fetchBotStatus,
  fetchBotDetails,
  restartBot,
  stopBot,
  updateBotDetails,
} from '../../services/adminService';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';
import { FaSync, FaStop, FaEdit } from 'react-icons/fa';
import CodeEditor from '../utils/CodeEditor';

const GlobalBotManagement = () => {
  const [botDetails, setBotDetails] = useState(null);
  const [botStatus, setBotStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    avatarUrl: '',
    disableAddingToServers: false,
  });

  const getBotInfo = async () => {
    try {
      const [detailsRes, statusRes] = await Promise.all([fetchBotDetails(), fetchBotStatus()]);
      setBotDetails(detailsRes.data);
      setBotStatus(statusRes.data);
    } catch (error) {
      console.error('Error fetching bot info:', error);
      toast.error('Failed to fetch bot information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBotInfo();
  }, []);

  const handleRestartBot = async () => {
    try {
      await restartBot();
      toast.success('Bot restart initiated.');
      // Optionally, refresh bot status after a delay
    } catch (error) {
      console.error('Error restarting bot:', error);
      toast.error('Failed to restart bot.');
    }
  };

  const handleStopBot = async () => {
    try {
      await stopBot();
      toast.success('Bot stop initiated.');
      // Optionally, refresh bot status after a delay
    } catch (error) {
      console.error('Error stopping bot:', error);
      toast.error('Failed to stop bot.');
    }
  };

  const handleEditBotDetails = () => {
    if (botDetails) {
      setEditData({
        name: botDetails.name || '',
        description: botDetails.description || '',
        avatarUrl: botDetails.avatarUrl || '',
        disableAddingToServers: botDetails.disableAddingToServers || false,
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateBotDetails = async (updatedData) => {
    try {
      await updateBotDetails(updatedData);
      toast.success('Bot details updated successfully.');
      setShowEditModal(false);
      getBotInfo();
    } catch (error) {
      console.error('Error updating bot details:', error);
      toast.error('Failed to update bot details.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading Bot Management...</div>;
  }

  if (!botDetails || !botStatus) {
    return <div className="text-center">No bot information available.</div>;
  }

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Bot Management</h1>

      {/* Bot Details */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Bot Details</h2>
        <div className="flex items-center space-x-4">
          <img src={botDetails.avatarUrl} alt="Bot Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-xl font-semibold">{botDetails.name}</p>
            <p className="text-gray-600 dark:text-gray-300">{botDetails.description}</p>
            <p className="mt-2">
              Disable Adding to Servers:{' '}
              <span className="font-semibold">
                {botDetails.disableAddingToServers ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
          <button onClick={handleEditBotDetails} className="btn btn-info btn-sm flex items-center">
            <FaEdit className="mr-2" /> Edit Details
          </button>
        </div>
      </div>

      {/* Bot Status */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Bot Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard title="CPU Usage" value={botStatus.cpuUsage} />
          <MetricCard title="Memory Usage" value={botStatus.memoryUsage} />
          <MetricCard title="Database Size" value={botStatus.databaseSize} />
          <MetricCard title="Uptime" value={formatUptime(botStatus.uptime)} />
        </div>
      </div>

      {/* Bot Operations */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Bot Operations</h2>
        <div className="flex space-x-4">
          <button onClick={handleRestartBot} className="btn btn-primary flex items-center">
            <FaSync className="mr-2" /> Restart Bot
          </button>
          <button onClick={handleStopBot} className="btn btn-error flex items-center">
            <FaStop className="mr-2" /> Stop Bot
          </button>
        </div>
      </div>

      {/* Edit Bot Details Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Edit Bot Details</h3>
          <EditBotDetailsForm
            onSubmit={handleUpdateBotDetails}
            onClose={() => setShowEditModal(false)}
            initialData={editData}
          />
        </Modal>
      )}
    </div>
  );
};

// MetricCard Component
const MetricCard = ({ title, value }) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-xl">{value}</p>
  </div>
);

// EditBotDetailsForm Component
const EditBotDetailsForm = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Bot Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
          placeholder="Enter bot name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="textarea textarea-bordered w-full"
          placeholder="Enter bot description"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="avatarUrl">
          Avatar URL
        </label>
        <input
          type="url"
          name="avatarUrl"
          id="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Enter avatar image URL"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="disableAddingToServers"
          id="disableAddingToServers"
          checked={formData.disableAddingToServers}
          onChange={handleChange}
          className="toggle toggle-primary mr-2"
        />
        <label htmlFor="disableAddingToServers" className="text-sm font-medium">
          Disable Adding to Servers
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Update Details
        </button>
      </div>
    </form>
  );
};

// Utility function to format uptime
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
};

export default GlobalBotManagement;
