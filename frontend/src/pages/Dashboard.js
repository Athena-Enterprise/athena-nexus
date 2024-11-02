// frontend/src/pages/Dashboard.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CommandsEnabled from '../components/CommandsEnabled';
import ServerUsers from '../components/ServerUsers';
import PublicDocs from '../components/PublicDocs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, loading, fetchUser } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    toast.error('You must be logged in to view the dashboard.');
    return <div className="flex justify-center items-center h-screen">Please log in.</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 ml-64"> {/* Adjust ml-64 if Sidebar width changes */}
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="commands" element={<CommandsEnabled />} />
          <Route path="users" element={<ServerUsers />} />
          <Route path="docs" element={<PublicDocs />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
};

const Home = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}!</h1>
      <img
        src={
          user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
        }
        alt="User Avatar"
        className="w-24 h-24 rounded-full mb-4"
      />
      <p className="text-lg">Here's an overview of your server:</p>
      {/* You can add more personalized content here */}
    </div>
  );
};

export default Dashboard;
