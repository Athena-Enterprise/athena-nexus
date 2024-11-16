// frontend/src/components/common/BarChartCard.js

import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BarChartCard = ({ title, data, options = {} }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow h-96">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active Servers" fill="#4ade80" />
          <Bar dataKey="Inactive Servers" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

BarChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      'Active Servers': PropTypes.number.isRequired,
      'Inactive Servers': PropTypes.number.isRequired,
    })
  ).isRequired,
  options: PropTypes.object, // Not used in Recharts
};

export default BarChartCard;
