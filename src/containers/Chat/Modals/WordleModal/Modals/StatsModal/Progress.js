import React from 'react';
import PropTypes from 'prop-types';

Progress.propTypes = {
  index: PropTypes.number,
  size: PropTypes.number,
  label: PropTypes.string
};
export default function Progress({ index, size, label }) {
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
        <div style={{ width: `${8 + size}%` }}>{label}</div>
      </div>
    </div>
  );
}
