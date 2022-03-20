import React from 'react';
import PropTypes from 'prop-types';

Progress.propTypes = {
  index: PropTypes.number,
  size: PropTypes.number,
  label: PropTypes.string
};
export default function Progress({ index, size, label }) {
  return (
    <div className="flex justify-left m-1">
      <div className="items-center justify-center w-2">{index + 1}</div>
      <div className="w-full ml-2">
        <div style={{ width: `${8 + size}%` }}>{label}</div>
      </div>
    </div>
  );
}
