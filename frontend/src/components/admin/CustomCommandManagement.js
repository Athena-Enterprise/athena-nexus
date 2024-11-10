// frontend/src/components/admin/CustomCommandManagement.js

import React, { useEffect, useState } from 'react';
import {
  fetchCustomCommands,
  createCustomCommand,
  updateCustomCommand,
  deleteCustomCommand,
} from '../../services/adminService';
import { toast } from 'react-toastify';
import ConfirmModal from '../common/ConfirmModal';

const CustomCommandManagement = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [commandToDelete, setCommandToDelete] = useState(null);
  const [newCommand, setNewCommand] = useState({
    name: '',
    description: '',
    action: '',
    selector: '',
    enabled: true,
    serverId: '', // Assuming serverId is required
  });

  const predefinedActions = [
    'Assign Role',
    'Remove Role',
    'Send Embed',
    // Add more predefined actions as needed
  ];

  const predefinedSelectors = [
    'Select User',
    'Select Channel',
    'Select Role',
    // Add more predefined selectors as needed
  ];

  const getCustomCommands = async () => {
    try {
      const response = await fetchCustomCommands();
      setCommands(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching custom commands:', error);
      toast.error('Failed to load custom commands.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomCommands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCommand((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateCommand = async (e) => {
    e.preventDefault();
    try {
      await createCustomCommand(newCommand);
      toast.success('Custom command created successfully.');
      setNewCommand({
        name: '',
        description: '',
        action: '',
        selector: '',
        enabled: true,
        serverId: '',
      });
      getCustomCommands();
    } catch (error) {
      console.error('Error creating custom command:', error);
      toast.error('Failed to create custom command.');
    }
  };

  const handleUpdateCommand = async (id, updatedFields) => {
    try {
      await updateCustomCommand(id, updatedFields);
      toast.success('Custom command updated successfully.');
      getCustomCommands();
    } catch (error) {
      console.error('Error updating custom command:', error);
      toast.error('Failed to update custom command.');
    }
  };

  const handleDeleteCommand = async () => {
    try {
      await deleteCustomCommand(commandToDelete.id);
      toast.success('Custom command deleted successfully.');
      setShowConfirm(false);
      setCommandToDelete(null);
      getCustomCommands();
    } catch (error) {
      console.error('Error deleting custom command:', error);
      toast.error('Failed to delete custom command.');
      setShowConfirm(false);
      setCommandToDelete(null);
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Custom Command Management</h1>

      {/* Create New Command Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Custom Command</h2>
        <form onSubmit={handleCreateCommand} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Command Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={newCommand.name}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={newCommand.description}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="action">
              Action
            </label>
            <select
              name="action"
              id="action"
              value={newCommand.action}
              onChange={handleInputChange}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select Action
              </option>
              {predefinedActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="selector">
              Selector
            </label>
            <select
              name="selector"
              id="selector"
              value={newCommand.selector}
              onChange={handleInputChange}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select Selector
              </option>
              {predefinedSelectors.map((selector) => (
                <option key={selector} value={selector}>
                  {selector}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="serverId">
              Server ID
            </label>
            <input
              type="text"
              name="serverId"
              id="serverId"
              value={newCommand.serverId}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
              placeholder="Enter Server ID"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="enabled"
              id="enabled"
              checked={newCommand.enabled}
              onChange={handleInputChange}
              className="checkbox checkbox-primary"
            />
            <label htmlFor="enabled" className="ml-2">
              Enabled
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Command
          </button>
        </form>
      </div>

      {/* Existing Commands Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Custom Commands</h2>
        {loading ? (
          <div className="text-center">Loading Commands...</div>
        ) : commands.length === 0 ? (
          <div className="text-center">No custom commands available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Selector</th>
                  <th className="px-4 py-2">Server</th>
                  <th className="px-4 py-2">Enabled</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commands.map((cmd) => (
                  <tr key={cmd.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{cmd.name}</td>
                    <td className="border px-4 py-2">{cmd.description}</td>
                    <td className="border px-4 py-2">{cmd.action}</td>
                    <td className="border px-4 py-2">{cmd.selector}</td>
                    <td className="border px-4 py-2">{cmd.serverId}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={cmd.enabled}
                        onChange={(e) => handleUpdateCommand(cmd.id, { enabled: e.target.checked })}
                        className="checkbox checkbox-primary"
                      />
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      {/* Future: Implement edit functionality */}
                      <button
                        onClick={() => {
                          setCommandToDelete(cmd);
                          setShowConfirm(true);
                        }}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Delete Custom Command"
          message={`Are you sure you want to delete the command "${commandToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteCommand}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default CustomCommandManagement;
