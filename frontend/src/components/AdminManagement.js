// frontend/src/components/AdminManagement.js

import React from 'react';

const AdminManagement = ({ admins, newAdminId, setNewAdminId, onAddAdmin, onRemoveAdmin }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Management</h2>
      <div className="overflow-x-auto mb-4">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Username</th>
              <th>Discriminator</th>
              <th>Discord ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.username}</td>
                <td>{admin.discriminator}</td>
                <td>{admin.discordId}</td>
                <td>
                  {admin.discordId !== '228658618684276736' && ( // Prevent removing yourself if desired
                    <button
                      onClick={() => onRemoveAdmin(admin.discordId)}
                      className="btn btn-sm btn-error"
                    >
                      Remove Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Discord ID"
          value={newAdminId}
          onChange={(e) => setNewAdminId(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={onAddAdmin} className="btn btn-primary">
          Add Admin
        </button>
      </div>
    </div>
  );
};

export default AdminManagement;
