// frontend/src/components/common/RecentActivityList.js

import React from 'react';
import PropTypes from 'prop-types';
import { FaUserPlus, FaUserMinus, FaServer, FaQuestion } from 'react-icons/fa';

const RecentActivityList = ({ activities = [] }) => {
  const getIcon = (actionType) => {
    switch (actionType) {
      case 'user_signup':
        return <FaUserPlus className="text-green-500" />;
      case 'user_deletion':
        return <FaUserMinus className="text-red-500" />;
      case 'server_addition':
        return <FaServer className="text-blue-500" />;
      // Add more cases as needed
      default:
        return <FaQuestion className="text-gray-500" />; // Default icon
    }
  };

  if (activities.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <p className="text-sm text-gray-500">No recent activities available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-center mb-2">
            <div className="mr-3">{getIcon(activity.type)}</div>
            <div>
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

RecentActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string, // Made optional
      description: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ),
};

export default RecentActivityList;
