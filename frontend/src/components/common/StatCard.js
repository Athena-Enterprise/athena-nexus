// frontend/src/components/common/StatCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';

const StatCard = ({ title, value, icon, color = 'green', onClick = () => {} }) => {
  return (
    <div
      className={`flex items-center p-4 bg-${color}-100 rounded-lg shadow cursor-pointer hover:bg-${color}-200 transition-colors duration-300`}
      onClick={onClick}
    >
      <IconContext.Provider value={{ size: '2em', className: `text-${color}-500` }}>
        <div>{icon}</div>
      </IconContext.Provider>
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string, // Tailwind color suffix, e.g., 'green', 'blue'
  onClick: PropTypes.func,
};

export default StatCard;
