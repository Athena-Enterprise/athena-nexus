// frontend/src/components/AdminManagement.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdminId, setNewAdminId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminId) {
      toast.error('Please enter a Discord ID.');
      return;
    }
    try {
      await api.post('/admins', { discordId: newAdminId });
      toast.success('Admin added successfully.');
      setNewAdminId('');
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin.');
    }
  };

  const handleRemoveAdmin = async (discordId) => {
    try {
      await api.delete(`/admins/${discordId}`);
      toast.success('Admin removed successfully.');
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading admins...</div>;
  }

  if (!admins.length) {
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
                  {admin.discordId !== '228658618684276736' && ( // Prevent removing yourself if desired
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
