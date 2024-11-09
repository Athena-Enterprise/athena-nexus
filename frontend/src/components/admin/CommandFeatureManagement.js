// frontend/src/components/admin/CommandFeatureManagement.js

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CodeEditor from '../utils/CodeEditor';

const CommandFeatureManagement = () => {
  const [commands, setCommands] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommand, setNewCommand] = useState({
    name: '',
    description: '',
    code: '',
    featureId: '',
  });
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
  });
  const [editingCommand, setEditingCommand] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);

  useEffect(() => {
    fetchCommands();
    fetchFeatures();
  }, []);

  const fetchCommands = async () => {
    try {
      const response = await api.get('/admin/commands');
      setCommands(response.data.commands);
    } catch (error) {
      console.error('Error fetching commands:', error);
      toast.error('Failed to fetch commands.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await api.get('/admin/features');
      setFeatures(response.data.features);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to fetch features.');
    }
  };

  // ----------------- Command Handlers -----------------

  const handleCreateCommand = async () => {
    const { name, description, code, featureId } = newCommand;
    if (!name || !description || !code || !featureId) {
      toast.warn('Please fill in all command fields.');
      return;
    }

    try {
      const response = await api.post('/admin/commands', newCommand);
      setCommands([...commands, response.data.command]);
      toast.success('Command created successfully.');
      setNewCommand({ name: '', description: '', code: '', featureId: '' });
    } catch (error) {
      console.error('Error creating command:', error);
      toast.error('Failed to create command.');
    }
  };

  const handleUpdateCommand = async () => {
    const { id, name, description, code, featureId, enabled } = editingCommand;
    if (!name || !description || !code || !featureId) {
      toast.warn('Please fill in all required command fields.');
      return;
    }

    try {
      const response = await api.put(`/admin/commands/${id}`, {
        name,
        description,
        code,
        featureId,
        enabled,
      });
      setCommands(commands.map((cmd) => (cmd.id === id ? response.data.command : cmd)));
      toast.success('Command updated successfully.');
      setEditingCommand(null);
    } catch (error) {
      console.error('Error updating command:', error);
      toast.error('Failed to update command.');
    }
  };

  const handleDeleteCommand = async (id) => {
    if (!window.confirm('Are you sure you want to delete this command?')) return;

    try {
      await api.delete(`/admin/commands/${id}`);
      setCommands(commands.filter((cmd) => cmd.id !== id));
      toast.success('Command deleted successfully.');
    } catch (error) {
      console.error('Error deleting command:', error);
      toast.error('Failed to delete command.');
    }
  };

  const toggleCommandEnabled = async (command) => {
    try {
      const updatedCommand = { ...command, enabled: !command.enabled };
      const response = await api.put(`/admin/commands/${command.id}`, updatedCommand);
      setCommands(
        commands.map((cmd) => (cmd.id === command.id ? response.data.command : cmd))
      );
      toast.success('Command status updated successfully.');
    } catch (error) {
      console.error('Error toggling command status:', error);
      toast.error('Failed to update command status.');
    }
  };

  // ----------------- Feature Handlers -----------------

  const handleCreateFeature = async () => {
    const { name, description } = newFeature;
    if (!name || !description) {
      toast.warn('Please fill in all feature fields.');
      return;
    }

    try {
      const response = await api.post('/admin/features', newFeature);
      setFeatures([...features, response.data.feature]);
      toast.success('Feature created successfully.');
      setNewFeature({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating feature:', error);
      toast.error('Failed to create feature.');
    }
  };

  const handleUpdateFeature = async () => {
    const { id, name, description, enabled } = editingFeature;
    if (!name || !description) {
      toast.warn('Please fill in all required feature fields.');
      return;
    }

    try {
      const response = await api.put(`/admin/features/${id}`, {
        name,
        description,
        enabled,
      });
      setFeatures(features.map((feat) => (feat.id === id ? response.data.feature : feat)));
      toast.success('Feature updated successfully.');
      setEditingFeature(null);
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update feature.');
    }
  };

  const handleDeleteFeature = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    try {
      await api.delete(`/admin/features/${id}`);
      setFeatures(features.filter((feat) => feat.id !== id));
      toast.success('Feature deleted successfully.');
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature.');
    }
  };

  const toggleFeatureEnabled = async (feature) => {
    try {
      const updatedFeature = { ...feature, enabled: !feature.enabled };
      const response = await api.put(`/admin/features/${feature.id}`, updatedFeature);
      setFeatures(
        features.map((feat) => (feat.id === feature.id ? response.data.feature : feat))
      );
      toast.success('Feature status updated successfully.');
    } catch (error) {
      console.error('Error toggling feature status:', error);
      toast.error('Failed to update feature status.');
    }
  };

  if (loading) {
    return <div>Loading Command and Feature Management...</div>;
  }

  return (
    <div className="space-y-12 p-6 bg-base-100 rounded-lg shadow-md">
      {/* Command Management */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Command Management</h2>

        {/* Create New Command */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Create New Command</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Command Name"
              value={newCommand.name}
              onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Command Description"
              value={newCommand.description}
              onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
              className="input input-bordered w-full"
            />
            <select
              value={newCommand.featureId}
              onChange={(e) => setNewCommand({ ...newCommand, featureId: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="">Select Feature</option>
              {features.map((feature) => (
                <option key={feature.id} value={feature.id}>
                  {feature.name}
                </option>
              ))}
            </select>
            <CodeEditor
              language="javascript"
              value={newCommand.code}
              onChange={(value) => setNewCommand({ ...newCommand, code: value })}
            />
            <button onClick={handleCreateCommand} className="btn btn-primary flex items-center">
              <FaPlus className="mr-2" /> Create Command
            </button>
          </div>
        </div>

        {/* Commands Table */}
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Code</th>
                <th>Feature</th>
                <th>Enabled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd) => (
                <tr key={cmd.id}>
                  <td>{cmd.name}</td>
                  <td>{cmd.description}</td>
                  <td>
                    <CodeEditor
                      language="javascript"
                      value={cmd.code}
                      readOnly
                      height="100px"
                    />
                  </td>
                  <td>
                    {features.find((feat) => feat.id === cmd.featureId)?.name || 'None'}
                  </td>
                  <td>
                    <label className="cursor-pointer label">
                      <input
                        type="checkbox"
                        checked={cmd.enabled}
                        onChange={() => toggleCommandEnabled(cmd)}
                        className="toggle toggle-primary"
                      />
                    </label>
                  </td>
                  <td>
                    <button
                      onClick={() => setEditingCommand(cmd)}
                      className="btn btn-sm btn-info mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCommand(cmd.id)}
                      className="btn btn-sm btn-error"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Command Modal */}
        {editingCommand && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h3 className="text-xl font-semibold mb-4">Edit Command</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Command Name"
                  value={editingCommand.name}
                  onChange={(e) =>
                    setEditingCommand({ ...editingCommand, name: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Command Description"
                  value={editingCommand.description}
                  onChange={(e) =>
                    setEditingCommand({ ...editingCommand, description: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
                <select
                  value={editingCommand.featureId}
                  onChange={(e) =>
                    setEditingCommand({ ...editingCommand, featureId: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select Feature</option>
                  {features.map((feature) => (
                    <option key={feature.id} value={feature.id}>
                      {feature.name}
                    </option>
                  ))}
                </select>
                <CodeEditor
                  language="javascript"
                  value={editingCommand.code}
                  onChange={(value) =>
                    setEditingCommand({ ...editingCommand, code: value })
                  }
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => setEditingCommand(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCommand}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------- */}

      {/* Feature Management */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Feature Management</h2>

        {/* Create New Feature */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Create New Feature</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Feature Name"
              value={newFeature.name}
              onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
              className="input input-bordered w-full"
            />
            <textarea
              placeholder="Feature Description"
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              className="textarea textarea-bordered w-full"
            ></textarea>
            <button onClick={handleCreateFeature} className="btn btn-primary flex items-center">
              <FaPlus className="mr-2" /> Create Feature
            </button>
          </div>
        </div>

        {/* Features Table */}
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Enabled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat) => (
                <tr key={feat.id}>
                  <td>{feat.name}</td>
                  <td>{feat.description}</td>
                  <td>
                    <label className="cursor-pointer label">
                      <input
                        type="checkbox"
                        checked={feat.enabled}
                        onChange={() => toggleFeatureEnabled(feat)}
                        className="toggle toggle-primary"
                      />
                    </label>
                  </td>
                  <td>
                    <button
                      onClick={() => setEditingFeature(feat)}
                      className="btn btn-sm btn-info mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feat.id)}
                      className="btn btn-sm btn-error"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Feature Modal */}
        {editingFeature && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
              <h3 className="text-xl font-semibold mb-4">Edit Feature</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Feature Name"
                  value={editingFeature.name}
                  onChange={(e) =>
                    setEditingFeature({ ...editingFeature, name: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
                <textarea
                  placeholder="Feature Description"
                  value={editingFeature.description}
                  onChange={(e) =>
                    setEditingFeature({ ...editingFeature, description: e.target.value })
                  }
                  className="textarea textarea-bordered w-full"
                ></textarea>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setEditingFeature(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateFeature}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandFeatureManagement;
