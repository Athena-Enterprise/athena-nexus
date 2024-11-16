// frontend/src/components/common/ActivityCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { FaChartBar } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const ActivityCard = ({ title, value, color = 'purple' }) => {
  return (
    <div className={`flex items-center p-4 bg-${color}-100 rounded-lg shadow`}>
      <IconContext.Provider value={{ size: '2em', className: `text-${color}-500` }}>
        <div><FaChartBar /></div>
      </IconContext.Provider>
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    </div>
  );
};

ActivityCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string, // Tailwind color suffix
};

export default ActivityCard;
