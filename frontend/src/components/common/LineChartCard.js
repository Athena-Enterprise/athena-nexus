// frontend/src/components/common/CommandsLineChart.js

import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CommandsLineChart = ({ title, data }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow h-96">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="commands" stroke="#f59e0b" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

CommandsLineChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      hour: PropTypes.string.isRequired,
      commands: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CommandsLineChart;
