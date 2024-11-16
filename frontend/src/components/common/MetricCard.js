// frontend/src/components/common/MetricCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';

const MetricCard = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className={`flex items-center p-4 bg-${color}-100 rounded-lg shadow`}>
      <IconContext.Provider value={{ size: '2em', className: `text-${color}-500` }}>
        <div>{icon}</div>
      </IconContext.Provider>
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl">{value}</p>
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string, // Tailwind color suffix
};

export default MetricCard;
