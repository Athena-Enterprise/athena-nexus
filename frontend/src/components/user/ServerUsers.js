// frontend/src/components/ServerUsers.js

import React from 'react';
import useFetch from '../../hooks/useFetch';
import { toast } from 'react-toastify';

const ServerUsers = () => {
  const { data: users, loading, error } = useFetch('/servers/me/users');

  if (loading) {
    return <div>Loading Server Users...</div>;
  }

  if (error) {
    toast.error('Failed to fetch server users.');
    return <div className="text-center text-error">Error loading server users.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Server Users</h2>
      {users.length === 0 ? (
        <p>No users on the server.</p>
      ) : (
        <ul className="list-disc list-inside">
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServerUsers;
