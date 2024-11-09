// frontend/src/components/common/StatCard.js

import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`flex items-center p-4 bg-${color}-100 rounded-lg shadow`}>
      <div className={`text-${color}-500 text-4xl`}>{icon}</div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
