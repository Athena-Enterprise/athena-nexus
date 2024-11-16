// frontend/src/components/common/Notifications.js

import React from 'react';
import PropTypes from 'prop-types';
import { FaBell } from 'react-icons/fa';

const Notifications = ({ notifications = [] }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaBell className="mr-2 text-yellow-500" />
          Notifications
        </h2>
        <p className="text-sm text-gray-500">No notifications available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaBell className="mr-2 text-yellow-500" />
        Notifications
      </h2>
      <ul>
        {notifications.map((note) => (
          <li key={note.id} className="mb-2">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full ${
                  note.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                {/* You can add different icons based on notification type */}
                <FaBell className="text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{note.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string, // Made optional
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ),
};

export default Notifications;
