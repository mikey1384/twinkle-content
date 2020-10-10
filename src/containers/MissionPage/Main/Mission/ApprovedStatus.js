import React from 'react';
import PropTypes from 'prop-types';

ApprovedStatus.propTypes = {
  myAttempt: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function ApprovedStatus({ myAttempt, style }) {
  return (
    <div
      style={{
        width: '100%',
        fontSize: '1.7rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: 2,
        ...style
      }}
    >
      <div>{myAttempt.feedback}</div>
    </div>
  );
}
