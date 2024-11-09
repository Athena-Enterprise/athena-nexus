// frontend/src/components/AdminManagement.js

import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch'; // Import useFetch hook
import { addAdmin, removeAdmin } from '../../services/adminService';
import { toast } from 'react-toastify';

const AdminManagement = () => {
  const [newAdminId, setNewAdminId] = useState('');

  // Use useFetch to fetch admins
  const { data: admins, loading, error } = useFetch('/admins');

  const handleAddAdmin = async () => {
    if (!newAdminId) {
      toast.error('Please enter a Discord ID.');
      return;
    }
    try {
      await addAdmin(newAdminId);
      toast.success('Admin added successfully.');
      setNewAdminId('');
      // Optionally, refetch the admins or trigger a re-render
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin.');
    }
  };

  const handleRemoveAdmin = async (discordId) => {
    try {
      await removeAdmin(discordId);
      toast.success('Admin removed successfully.');
      // Optionally, refetch the admins or trigger a re-render
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading admins...</div>;
  }

  if (error) {
    console.error('Error fetching admins:', error);
    toast.error('Failed to fetch admins.');
    return <div className="text-center">Error loading admins.</div>;
  }

  if (!admins || admins.length === 0) {
    return <div className="text-center">No admins available.</div>;
  }

  return (
    <div className="pt-20 card shadow-lg p-6 bg-base-100">
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
                  {/* Prevent removing yourself as an admin */}
                  {admin.discordId !== 'YOUR_DISCORD_ID_HERE' && (
                    <button
                      onClick={() => handleRemoveAdmin(admin.discordId)}
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
        <button onClick={handleAddAdmin} className="btn btn-primary">
          Add Admin
        </button>
      </div>
    </div>
  );
};

export default AdminManagement;