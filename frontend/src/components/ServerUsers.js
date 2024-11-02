// frontend/src/components/ServerUsers.js

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';

const ServerUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/servers/me/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching server users:', error);
      toast.error('Failed to fetch server users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading Server Users...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Server Users</h2>
      {users.length === 0 ? (
        <p>No users on the server.</p>
      ) : (
        <ul className="list-disc list-inside">
          {users.map((user) => (
            <li key={user.id}>{user.username}#{user.discriminator}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServerUsers;
