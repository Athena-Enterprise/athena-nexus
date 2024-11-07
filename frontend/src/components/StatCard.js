// src/components/StatCard.js

import React from 'react';

const StatCard = ({ title, value, icon }) => (
  <div className="card bg-base-100 shadow-lg p-6 flex items-center">
    <div className="text-4xl mr-4">{icon}</div>
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;
