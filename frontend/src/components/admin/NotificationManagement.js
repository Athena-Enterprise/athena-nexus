// frontend/src/components/admin/NotificationManagement.js

import React, { useEffect, useState } from 'react';
import {
  fetchNotifications,
  createNotification,
  deleteNotification,
} from '../../services/adminService';
import { toast } from 'react-toastify';
import ConfirmModal from '../common/ConfirmModal';
import Modal from '../common/Modal';
import { FaPlus, FaTrash } from 'react-icons/fa';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info', // 'info', 'warning', 'error'
  });

  const getNotifications = async () => {
    try {
      const response = await fetchNotifications();
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      await createNotification(newNotification);
      toast.success('Notification created successfully.');
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
      });
      setShowCreateModal(false);
      getNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Failed to create notification.');
    }
  };

  const handleDeleteNotification = async () => {
    try {
      await deleteNotification(notificationToDelete.id);
      toast.success('Notification deleted successfully.');
      setShowConfirm(false);
      setNotificationToDelete(null);
      getNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification.');
      setShowConfirm(false);
      setNotificationToDelete(null);
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
    });
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notification Management</h1>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" /> Create Notification
        </button>
      </div>

      {/* Existing Notifications List */}
      <div>
        {loading ? (
          <div className="text-center">Loading Notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center">No notifications available.</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{notif.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{notif.message}</p>
                  <span className={`badge ${notif.type === 'info' ? 'badge-info' : notif.type === 'warning' ? 'badge-warning' : 'badge-error'}`}>
                    {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => {
                    setNotificationToDelete(notif);
                    setShowConfirm(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Notification"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <Modal onClose={closeCreateModal}>
          <h3 className="text-xl font-semibold mb-4">Create New Notification</h3>
          <form onSubmit={handleCreateNotification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={newNotification.title}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                value={newNotification.message}
                onChange={handleInputChange}
                required
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="type">
                Type
              </label>
              <select
                name="type"
                id="type"
                value={newNotification.type}
                onChange={handleInputChange}
                required
                className="select select-bordered w-full"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={closeCreateModal} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Notification
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ConfirmModal
          title={`Delete Notification "${notificationToDelete.title}"`}
          message={`Are you sure you want to delete the notification "${notificationToDelete.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteNotification}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default NotificationManagement;
