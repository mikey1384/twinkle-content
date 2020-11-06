import React from 'react';
import PropTypes from 'prop-types';

ChangeUsername.propTypes = {
  style: PropTypes.object
};

export default function ChangeUsername({ style }) {
  return (
    <div style={style}>
      <div>Change!</div>
    </div>
  );
}
