// frontend/src/components/admin/CommandFeatureManagement.js

import React, { useEffect, useState } from 'react';
import {
  fetchAdminCommands,
  fetchAdminFeatures,
  createAdminCommand,
  updateAdminCommand,
  deleteAdminCommand,
} from '../../services/adminService';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CodeEditor from '../utils/CodeEditor';

const CommandFeatureManagement = () => {
  const [commands, setCommands] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCommandModal, setShowCommandModal] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const getData = async () => {
    try {
      const [commandsRes, featuresRes] = await Promise.all([fetchAdminCommands(), fetchAdminFeatures()]);
      setCommands(commandsRes.data);
      setFeatures(featuresRes.data);
    } catch (error) {
      console.error('Error fetching commands and features:', error);
      toast.error('Failed to fetch commands and features.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Command Handlers
  const handleCreateCommand = async (commandData) => {
    try {
      await createAdminCommand(commandData);
      toast.success('Command created successfully.');
      setShowCommandModal(false);
      getData();
    } catch (error) {
      console.error('Error creating command:', error);
      toast.error('Failed to create command.');
    }
  };

  const handleUpdateCommand = async (commandId, updatedData) => {
    try {
      await updateAdminCommand(commandId, updatedData);
      toast.success('Command updated successfully.');
      setEditingCommand(null);
      getData();
    } catch (error) {
      console.error('Error updating command:', error);
      toast.error('Failed to update command.');
    }
  };

  const handleDeleteCommand = async () => {
    try {
      await deleteAdminCommand(itemToDelete.id);
      toast.success('Command deleted successfully.');
      setShowConfirm(false);
      setItemToDelete(null);
      getData();
    } catch (error) {
      console.error('Error deleting command:', error);
      toast.error('Failed to delete command.');
    }
  };

  // General Delete Handler
  const confirmDelete = (command) => {
    setItemToDelete(command);
    setShowConfirm(true);
  };

  // Toggle Handlers
  const toggleCommandStatus = async (command) => {
    try {
      await updateAdminCommand(command.id, { enabled: !command.enabled });
      toast.success(`Command "${command.name}" ${command.enabled ? 'disabled' : 'enabled'}.`);
      getData();
    } catch (error) {
      console.error('Error toggling command status:', error);
      toast.error('Failed to toggle command status.');
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Command Management</h1>
        <button onClick={() => setShowCommandModal(true)} className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" /> Add Command
        </button>
      </div>

      {/* Commands List */}
      <div>
        {loading ? (
          <div className="text-center">Loading Commands...</div>
        ) : commands.length === 0 ? (
          <div className="text-center">No commands found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commands.map((cmd) => (
              <div key={cmd.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{cmd.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCommand(cmd)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Command"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(cmd)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Command"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{cmd.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="font-semibold">Feature:</span> {cmd.feature ? cmd.feature.name : 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">{cmd.enabled ? 'Enabled' : 'Disabled'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={cmd.enabled}
                        onChange={() => toggleCommandStatus(cmd)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Command Modal */}
      {showCommandModal && (
        <Modal onClose={() => setShowCommandModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Create New Command</h3>
          <CommandForm
            onSubmit={handleCreateCommand}
            onClose={() => setShowCommandModal(false)}
            features={features}
          />
        </Modal>
      )}

      {/* Edit Command Modal */}
      {editingCommand && (
        <Modal onClose={() => setEditingCommand(null)}>
          <h3 className="text-xl font-semibold mb-4">Edit Command</h3>
          <CommandForm
            onSubmit={(updatedData) => handleUpdateCommand(editingCommand.id, updatedData)}
            onClose={() => setEditingCommand(null)}
            initialData={editingCommand}
            features={features}
            isEdit
          />
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ConfirmModal
          title={`Delete Command "${itemToDelete.name}"`}
          message={`Are you sure you want to delete the command "${itemToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteCommand}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

// CommandForm Component
const CommandForm = ({ onSubmit, onClose, initialData = {}, features, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    action: initialData.action || '',
    selector: initialData.selector || '',
    tier: initialData.tier || 'free',
    featureId: initialData.featureId || '',
    enabled: initialData.enabled !== undefined ? initialData.enabled : true,
  });

  const [code, setCode] = useState(initialData.action || '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedData = { ...formData, action: code };
    onSubmit(combinedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Command Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
          placeholder="Enter command name"
          disabled={isEdit} // Disable name change when editing
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
          placeholder="Enter command description"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="selector">
          Selector
        </label>
        <select
          name="selector"
          id="selector"
          value={formData.selector}
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Selector</option>
          <option value="Select User">Select User</option>
          <option value="Select Channel">Select Channel</option>
          <option value="Select Role">Select Role</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="tier">
          Tier
        </label>
        <select
          name="tier"
          id="tier"
          value={formData.tier}
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="free">Free</option>
          <option value="community">Community</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="featureId">
          Associated Feature
        </label>
        <select
          name="featureId"
          id="featureId"
          value={formData.featureId}
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Feature</option>
          {features.map((feat) => (
            <option key={feat.id} value={feat.id}>
              {feat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="enabled"
          id="enabled"
          checked={formData.enabled}
          onChange={handleChange}
          className="toggle toggle-primary mr-2"
        />
        <label htmlFor="enabled" className="text-sm font-medium">
          Enabled
        </label>
      </div>

      {/* Code Editor */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="action">
          Command Code
        </label>
        <CodeEditor
          language="javascript"
          value={code}
          onChange={setCode}
          readOnly={false}
          height="300px"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Update Command' : 'Create Command'}
        </button>
      </div>
    </form>
  );
};

export default CommandFeatureManagement;
