import React from 'react';
import PropTypes from 'prop-types';
import { REVEAL_TIME_MS } from '../constants/settings';

Cell.propTypes = {
  value: PropTypes.string,
  position: PropTypes.number
};

export default function Cell({ value, position = 0 }) {
  const animationDelay = `${position * REVEAL_TIME_MS}ms`;

  return (
    <div style={{ animationDelay }}>
      <div style={{ animationDelay }}>{value}</div>
    </div>
  );
}
