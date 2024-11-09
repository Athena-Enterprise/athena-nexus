// frontend/src/components/admin/UserManagement.js

import React, { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { toast } from 'react-toastify';
import { fetchAllUsers, addAdmin, removeAdmin } from '../../services/adminService';

const UserManagement = () => {
  const { data: users, loading, error, refetch } = useFetch('/admins/users'); // Assuming useFetch supports refetch
  const [newAdminId, setNewAdminId] = useState('');

  const handlePromote = async (discordId) => {
    try {
      await addAdmin(discordId);
      toast.success('User promoted to admin.');
      refetch(); // Refetch users to update the list
    } catch (err) {
      console.error('Error promoting user:', err);
      toast.error('Failed to promote user.');
    }
  };

  const handleDemote = async (discordId) => {
    try {
      await removeAdmin(discordId);
      toast.success('User demoted from admin.');
      refetch(); // Refetch users to update the list
    } catch (err) {
      console.error('Error demoting user:', err);
      toast.error('Failed to demote user.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading User Management...</div>;
  }

  if (error) {
    toast.error('Failed to fetch users.');
    return <div className="text-center text-error">Error loading users.</div>;
  }

  if (!users || users.length === 0) {
    return <div className="text-center">No users found.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Admin</th>
            <th className="py-2 px-4 border-b">Premium</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email || 'N/A'}</td>
              <td className="py-2 px-4 border-b">{user.isAdmin ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">{user.isPremium ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">
                {user.isAdmin ? (
                  <button
                    onClick={() => handleDemote(user.discordId)}
                    className="btn btn-warning btn-sm"
                  >
                    Demote
                  </button>
                ) : (
                  <button
                    onClick={() => handlePromote(user.discordId)}
                    className="btn btn-success btn-sm"
                  >
                    Promote
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
