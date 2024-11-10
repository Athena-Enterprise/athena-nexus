// frontend/src/components/admin/UserManagement.js

import React, { useEffect, useState } from 'react';
import { fetchAllUsers, addAdmin, removeAdmin } from '../../services/adminService';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user } = useAuth(); // Get the current logged-in admin
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminDiscordId, setNewAdminDiscordId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDemote, setUserToDemote] = useState(null);

  const getAllUsers = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminDiscordId) {
      toast.warn('Please enter a Discord ID.');
      return;
    }
    try {
      await addAdmin({ discordId: newAdminDiscordId }); // Adjust payload as per backend requirement
      toast.success('User promoted to admin successfully.');
      setNewAdminDiscordId('');
      setShowAddAdminModal(false);
      getAllUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user.');
    }
  };

  const handleRemoveAdmin = async () => {
    try {
      await removeAdmin(userToDemote.discordId);
      toast.success('User demoted from admin successfully.');
      setShowConfirm(false);
      setUserToDemote(null);
      getAllUsers();
    } catch (error) {
      console.error('Error demoting user:', error);
      toast.error('Failed to demote user.');
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button onClick={() => setShowAddAdminModal(true)} className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" /> Promote to Admin
        </button>
      </div>

      {/* Users List */}
      <div>
        {loading ? (
          <div className="text-center">Loading Users...</div>
        ) : users.length === 0 ? (
          <div className="text-center">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Discriminator</th>
                  <th className="px-4 py-2">Discord ID</th>
                  <th className="px-4 py-2">Admin</th>
                  <th className="px-4 py-2">Premium</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{usr.username}</td>
                    <td className="border px-4 py-2">{usr.discriminator}</td>
                    <td className="border px-4 py-2">{usr.discordId}</td>
                    <td className="border px-4 py-2">{usr.isAdmin ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2">{usr.isPremium ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2">
                      {usr.isAdmin && usr.discordId !== user.discordId && (
                        <button
                          onClick={() => {
                            setUserToDemote(usr);
                            setShowConfirm(true);
                          }}
                          className="btn btn-error btn-sm"
                        >
                          Demote
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <Modal onClose={() => setShowAddAdminModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Promote User to Admin</h3>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="discordId">
                Discord ID
              </label>
              <input
                type="text"
                name="discordId"
                id="discordId"
                value={newAdminDiscordId}
                onChange={(e) => setNewAdminDiscordId(e.target.value)}
                required
                className="input input-bordered w-full"
                placeholder="Enter Discord ID"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => setShowAddAdminModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Promote
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Demote Modal */}
      {showConfirm && (
        <ConfirmModal
          title={`Demote Admin "${userToDemote.username}#${userToDemote.discriminator}"`}
          message={`Are you sure you want to demote "${userToDemote.username}#${userToDemote.discriminator}" from admin? This action cannot be undone.`}
          onConfirm={handleRemoveAdmin}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;
