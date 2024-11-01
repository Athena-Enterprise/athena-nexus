// frontend/src/components/BotManagement.js

import React from 'react';

const BotManagement = ({ commands, onToggle, onStatusChange }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Bot Management</h2>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Premium Only</th>
              <th>Enabled</th>
              <th>Status</th>
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
                  <button
                    onClick={() => onToggle(cmd.id, cmd.enabled)}
                    className={`btn btn-sm ${cmd.enabled ? 'btn-error' : 'btn-success'}`}
                  >
                    {cmd.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
                <td>
                  <select
                    value={cmd.status}
                    onChange={(e) => onStatusChange(cmd.id, e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    <option value="development">Development</option>
                    <option value="active">Active</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </td>
                <td>
                  {/* Placeholder for additional actions */}
                  <button className="btn btn-sm btn-info">Edit</button>
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
