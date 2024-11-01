// frontend/src/components/UserManagement.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const UserManagement = ({ onDeleteUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users'); // Adjust the endpoint if necessary
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully.');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };
  
  const makeAdmin = async (discordId) => {
    try {
      await api.post('/admin', { discordId }); // Adjust the endpoint if necessary
      toast.success('User promoted to admin successfully.');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
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
                  {user.discordId !== '228658618684276736' && ( // Prevent removing yourself if desired
                    <>
                      <button
                        onClick={() => onDeleteUser(user.id)}
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
