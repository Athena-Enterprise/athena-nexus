// frontend/src/components/ServerUserManagement.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ServerUserManagement = () => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServerMembers();
    fetchServerRoles();
  }, [selectedServerId]);

  const fetchServerMembers = async () => {
    try {
      const response = await api.get(`/servers/${selectedServerId}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching server members:', error);
      toast.error('Failed to fetch server members.');
    } finally {
      setLoading(false);
    }
  };

  const fetchServerRoles = async () => {
    try {
      const response = await api.get(`/servers/${selectedServerId}/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching server roles:', error);
      toast.error('Failed to fetch server roles.');
    }
  };

  const handleAssignRole = async (memberId, roleId) => {
    try {
      await api.post(`/servers/${selectedServerId}/members/${memberId}/roles`, { roleId });
      toast.success('Role assigned successfully.');
      fetchServerMembers(); // Refresh member list
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role.');
    }
  };

  const handleKickMember = async (memberId) => {
    try {
      await api.delete(`/servers/${selectedServerId}/members/${memberId}`);
      toast.success('Member kicked successfully.');
      fetchServerMembers();
    } catch (error) {
      console.error('Error kicking member:', error);
      toast.error('Failed to kick member.');
    }
  };

  const handleBanMember = async (memberId) => {
    try {
      await api.post(`/servers/${selectedServerId}/bans`, { memberId });
      toast.success('Member banned successfully.');
      fetchServerMembers();
    } catch (error) {
      console.error('Error banning member:', error);
      toast.error('Failed to ban member.');
    }
  };

  if (loading) {
    return <div>Loading Server Members...</div>;
  }

  return (
    <div className="pt-20">
      <h2 className="text-xl font-semibold mb-4">Server User Management</h2>
      {/* Server selection logic if necessary */}
      {/* Members Table */}
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Username</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.username}</td>
                <td>
                  {/* Display roles */}
                  {member.roles.map((role) => (
                    <span key={role.id} className="badge mr-1">
                      {role.name}
                    </span>
                  ))}
                </td>
                <td>
                  {/* Assign Role */}
                  <select
                    onChange={(e) => handleAssignRole(member.id, e.target.value)}
                    className="select select-bordered select-sm mr-2"
                  >
                    <option value="">Assign Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {/* Kick and Ban Buttons */}
                  <button
                    onClick={() => handleKickMember(member.id)}
                    className="btn btn-sm btn-warning mr-2"
                  >
                    Kick
                  </button>
                  <button
                    onClick={() => handleBanMember(member.id)}
                    className="btn btn-sm btn-error"
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServerUserManagement;
