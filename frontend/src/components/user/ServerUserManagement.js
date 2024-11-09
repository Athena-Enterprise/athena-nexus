// frontend/src/components/ServerUserManagement.js

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ServerUserManagement = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServerId, setSelectedServerId] = useState(null);

  useEffect(() => {
    // Fetch members when selectedServerId changes
    if (selectedServerId) {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServerId]);

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/servers/${selectedServerId}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await api.put(`/servers/${selectedServerId}/members/${memberId}`, { role: newRole });
      toast.success('Member role updated successfully.');
      fetchMembers(); // Refresh the members list
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role.');
    }
  };

  return (
    <div className="pt-20">
      <h2 className="text-xl font-semibold mb-4">Server User Management</h2>
      {/* Server selection logic */}
      {/* You can implement a dropdown to select a server if applicable */}
      {loading ? (
        <div>Loading Members...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.userId}>
                  <td>{member.user.username}</td>
                  <td>{member.role}</td>
                  <td>
                    {/* Allow role change if current user is owner or admin */}
                    {['owner', 'admin'].includes(member.role) && (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                        className="select select-bordered select-sm"
                      >
                        <option value="member">Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                    {/* Additional actions can be added here */}
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

export default ServerUserManagement;
