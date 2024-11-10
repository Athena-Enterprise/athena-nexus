// frontend/src/components/admin/ServerManagement.js

import React, { useEffect, useState } from 'react';
import { fetchServers, deleteServer, updateServerStatus } from '../../services/serverService';
import { toast } from 'react-toastify';
import ConfirmModal from '../common/ConfirmModal';
import Modal from '../common/Modal';

const ServerManagement = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverToDelete, setServerToDelete] = useState(null);
  const [editingServer, setEditingServer] = useState(null);
  const [serverStatus, setServerStatus] = useState('');

  const getServers = async () => {
    try {
      const response = await fetchServers();
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error('Failed to fetch servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServers();
  }, []);

  const handleDeleteServer = async () => {
    try {
      await deleteServer(serverToDelete.id);
      toast.success('Server deleted successfully.');
      setShowConfirm(false);
      setServerToDelete(null);
      getServers();
    } catch (error) {
      console.error('Error deleting server:', error);
      toast.error('Failed to delete server.');
      setShowConfirm(false);
      setServerToDelete(null);
    }
  };

  const handleUpdateStatus = async (serverId) => {
    if (!serverStatus) {
      toast.warn('Please select a status.');
      return;
    }
    try {
      await updateServerStatus(serverId, { status: serverStatus });
      toast.success('Server status updated successfully.');
      setEditingServer(null);
      setServerStatus('');
      getServers();
    } catch (error) {
      console.error('Error updating server status:', error);
      toast.error('Failed to update server status.');
    }
  };

  const openEditModal = (server) => {
    setEditingServer(server);
    setServerStatus(server.status);
  };

  const closeEditModal = () => {
    setEditingServer(null);
    setServerStatus('');
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Server Management</h1>

      {/* Servers List */}
      <div>
        {loading ? (
          <div className="text-center">Loading Servers...</div>
        ) : servers.length === 0 ? (
          <div className="text-center">No servers found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((srv) => (
              <div key={srv.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{srv.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(srv)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Server Status"
                    >
                      Edit Status
                    </button>
                    <button
                      onClick={() => {
                        setServerToDelete(srv);
                        setShowConfirm(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Server"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">ID: {srv.id}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Members: {srv.memberCount}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Premium: {srv.premium ? 'Yes' : 'No'}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Status: {srv.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {editingServer && (
        <Modal onClose={closeEditModal}>
          <h3 className="text-xl font-semibold mb-4">Edit Server Status</h3>
          <div className="space-y-4">
            <p>
              <strong>Server Name:</strong> {editingServer.name}
            </p>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="status">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={serverStatus}
                onChange={(e) => setServerStatus(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={closeEditModal} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleUpdateStatus(editingServer.id)} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ConfirmModal
          title={`Delete Server "${serverToDelete.name}"`}
          message={`Are you sure you want to delete the server "${serverToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteServer}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default ServerManagement;
