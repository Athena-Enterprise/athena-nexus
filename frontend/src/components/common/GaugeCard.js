// frontend/src/components/common/GaugeCard.js

import React from 'react';
import PropTypes from 'prop-types';
import ReactSpeedometer from "react-d3-speedometer";

const GaugeCard = ({ title, value, min = 0, max = 30, color = "#4ade80" }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow h-96 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ReactSpeedometer
        maxValue={max}
        minValue={min}
        value={value}
        segments={3}
        segmentColors={["#4ade80", "#f59e0b", "#f87171"]}
        needleColor={color}
        startColor="#4ade80"
        endColor="#f87171"
        needleTransitionDuration={500}
        needleTransition="easeElastic"
        currentValueText={`${value}d`}
        height={200}
        width={200}
      />
    </div>
  );
};

GaugeCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  color: PropTypes.string,
};

export default GaugeCard;
