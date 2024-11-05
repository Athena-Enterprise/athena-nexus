// frontend/src/components/CommandsEnabled.js

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CommandsEnabled = () => {
  const { selectedServerId, loading: authLoading, servers, setSelectedServerId } = useAuth();
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommands = async () => {
    if (!selectedServerId) {
      toast.error('No server selected.');
      setLoading(false);
      return;
    }

    try {
      console.log(`Fetching commands for server ID: ${selectedServerId}`);
      const response = await axios.get(`/servers/${selectedServerId}/commands`, { withCredentials: true });
      console.log('Commands fetched:', response.data);
      setCommands(response.data);
    } catch (error) {
      console.error('Error fetching commands:', error);
      toast.error('Failed to fetch commands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && selectedServerId) {
      fetchCommands();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, selectedServerId]);

  const handleToggle = async (commandId, currentEnabled) => {
    try {
      console.log(`Toggling command ID: ${commandId}, Current Enabled: ${currentEnabled}`);
      await axios.put(`/servers/${selectedServerId}/commands/${commandId}`, { enabled: !currentEnabled }, { withCredentials: true });

      // Optimistically update the state
      setCommands((prevCommands) =>
        prevCommands.map((cmd) =>
          cmd.id === commandId ? { ...cmd, enabled: !currentEnabled } : cmd
        )
      );
      toast.success('Command status updated successfully.');
      console.log(`Command ID: ${commandId} toggled to ${!currentEnabled}`);
    } catch (error) {
      console.error('Error toggling command:', error);
      toast.error('Failed to toggle command.');
    }
  };

  const handleServerChange = (e) => {
    const newServerId = e.target.value;
    console.log(`Selected new server ID: ${newServerId}`);
    setSelectedServerId(newServerId);
    setLoading(true);
    fetchCommands();
  };

  if (authLoading || loading) {
    return <div>Loading Commands...</div>;
  }

  return (
    <div className="pt-20">
      <h2 className="text-xl font-semibold mb-4">Commands Enabled</h2>
      {servers.length > 1 && (
        <div className="mb-4">
          <label className="mr-2">Select Server:</label>
          <select value={selectedServerId} onChange={handleServerChange} className="select select-bordered">
            {servers.map(server => (
              <option key={server.id} value={server.id}>{server.name}</option>
            ))}
          </select>
        </div>
      )}
      {commands.length === 0 ? (
        <p>No commands enabled.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Enabled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd) => (
                <tr key={cmd.id}>
                  <td>{cmd.name}</td>
                  <td>{cmd.description}</td>
                  <td>{cmd.status}</td>
                  <td>{cmd.enabled ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      onClick={() => handleToggle(cmd.id, cmd.enabled)}
                      className={`btn btn-sm ${cmd.enabled ? 'btn-error' : 'btn-success'}`}
                    >
                      {cmd.enabled ? 'Disable' : 'Enable'}
                    </button>
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

export default CommandsEnabled;
