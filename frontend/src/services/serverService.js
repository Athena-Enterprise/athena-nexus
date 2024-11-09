// frontend/src/services/serverService.js

import api from './api';

// Fetch all servers
export const fetchServers = async () => {
  try {
    const response = await api.get('/servers');
    return response.data;
  } catch (error) {
    console.error('Error fetching servers:', error);
    throw error;
  }
};

// Fetch server stats by id
export const fetchServerStats = async (id) => {
  try {
    const response = await api.get(`/servers/${id}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching server stats:', error);
    throw error;
  }
};

// Fetch server users
export const fetchServerUsers = async () => {
  try {
    const response = await api.get('/servers/me/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching server users:', error);
    throw error;
  }
};

// Fetch server channels
export const fetchServerChannels = async () => {
  try {
    const response = await api.get('/servers/me/channels');
    return response.data;
  } catch (error) {
    console.error('Error fetching server channels:', error);
    throw error;
  }
}

// Fetch server roles
export const fetchServerRoles = async () => {
  try {
    const response = await api.get('/servers/me/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching server roles:', error);
    throw error;
  }
}

// Fetch server invites (admin only)
export const fetchServerInvites = async () => {
  try {
    const response = await api.get('/servers/me/invites');
    return response.data;
  } catch (error) {
    console.error('Error fetching server invites:', error);
    throw error;
  }
}