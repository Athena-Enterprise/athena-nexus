// frontend/src/components/common/CommandUsageCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { FaTerminal } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const CommandUsageCard = ({ title, value, color = 'orange' }) => {
  return (
    <div className={`flex items-center p-4 bg-${color}-100 rounded-lg shadow`}>
      <IconContext.Provider value={{ size: '2em', className: `text-${color}-500` }}>
        <div><FaTerminal /></div>
      </IconContext.Provider>
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    </div>
  );
};

CommandUsageCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string, // Tailwind color suffix
};

export default CommandUsageCard;
