// src/pages/UserSettings.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserSettings() {
  const [userData, setUserData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [emailData, setEmailData] = useState({
    newEmail: '',
    currentPassword: '',
  });
  const [newsletter, setNewsletter] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user', { withCredentials: true });
        setUserData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/user/change-password', passwordData, {
        withCredentials: true,
      });
      setMessage('Password changed successfully.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password change failed.');
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/user/change-email', emailData, {
        withCredentials: true,
      });
      setMessage('Email changed successfully.');
      setEmailData({
        newEmail: '',
        currentPassword: '',
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Email change failed.');
    }
  };

  const handleUnlinkDiscord = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/unlink-discord', {}, {
        withCredentials: true,
      });
      setMessage('Discord account unlinked successfully.');
      setUserData(prev => ({ ...prev, id: null, avatar: null, discriminator: null }));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to unlink Discord account.');
    }
  };

  const handleNewsletterSubscription = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/subscribe-newsletter', { subscribe: newsletter }, {
        withCredentials: true,
      });
      setMessage(newsletter ? 'Subscribed to newsletter successfully.' : 'Unsubscribed from newsletter.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Newsletter subscription failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200 pt-20">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
              User Settings
            </h2>
          </div>
          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} shadow-lg`}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  {message.includes('successfully') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                <span>{message}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Change Password */}
            <div className="card bg-base-100 shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="form-control">
                  <label className="label" htmlFor="currentPassword">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    className="input input-bordered"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="newPassword">
                    <span className="label-text">New Password</span>
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="input input-bordered"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="confirmNewPassword">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    required
                    className="input input-bordered"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <button type="submit" className="btn btn-primary">Change Password</button>
                </div>
              </form>
            </div>

            {/* Change Email */}
            <div className="card bg-base-100 shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Change Email</h3>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div className="form-control">
                  <label className="label" htmlFor="newEmail">
                    <span className="label-text">New Email Address</span>
                  </label>
                  <input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    required
                    className="input input-bordered"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="currentPasswordEmail">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input
                    id="currentPasswordEmail"
                    name="currentPasswordEmail"
                    type="password"
                    required
                    className="input input-bordered"
                    value={emailData.currentPassword}
                    onChange={(e) => setEmailData({ ...emailData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <button type="submit" className="btn btn-primary">Change Email</button>
                </div>
              </form>
            </div>

            {/* Unlink Discord */}
            <div className="card bg-base-100 shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Discord Integration</h3>
              <button onClick={handleUnlinkDiscord} className="btn btn-error">Unlink Discord Account</button>
            </div>

            {/* Subscribe to Newsletter */}
            <div className="card bg-base-100 shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Newsletter Subscription</h3>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Subscribe to our newsletter</span>
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <button onClick={handleNewsletterSubscription} className="btn btn-primary">
                  {newsletter ? 'Subscribe' : 'Unsubscribe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
