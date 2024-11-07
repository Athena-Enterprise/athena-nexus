// frontend/src/components/UserManagement.js

import React from 'react';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';
import api from '../services/api';

const UserManagement = () => {
  const { data: users, loading, error } = useFetch('/api/users');
  
  const deleteUser = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully.');
      // Optionally, you can refetch users here
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  const makeAdmin = async (discordId) => {
    try {
      await api.post(`/api/users/${discordId}/promote`);
      toast.success('User promoted to admin successfully.');
      // Optionally, you can refetch users here
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user.');
    }
  };

  if (loading) {
    return <div>Loading Users...</div>;
  }

  if (error) {
    return <div>Error loading users.</div>;
  }

  return (
    <div className="pt-20 shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Username</th>
              <th>Discriminator</th>
              <th>Discord ID</th>
              <th>Is Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.discriminator}</td>
                <td>{user.discordId}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  {user.discordId !== 'YOUR_DISCORD_ID' && ( // Replace with your Discord ID to prevent self-deletion
                    <>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="btn btn-sm btn-error mr-2"
                      >
                        Delete User
                      </button>
                      {!user.isAdmin && (
                        <button
                          onClick={() => makeAdmin(user.discordId)}
                          className="btn btn-sm btn-success"
                        >
                          Make Admin
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
