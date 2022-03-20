import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';

Progress.propTypes = {
  currentDayStatRow: PropTypes.bool,
  index: PropTypes.number,
  size: PropTypes.number,
  label: PropTypes.string
};
export default function Progress({ currentDayStatRow, index, size, label }) {
  return (
    <div style={{ display: 'flex', textAlign: 'left' }}>
      <div
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '1rem'
        }}
      >
        {index + 1}
      </div>
      <div style={{ width: '100%', marginLeft: '0.5rem' }}>
        <div
          style={{
            width: `${8 + size}%`,
            textAlign: 'center',
            background: currentDayStatRow ? Color.blue() : Color.gray()
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
