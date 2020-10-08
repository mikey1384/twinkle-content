import React from 'react';
import PropTypes from 'prop-types';

PendingStatus.propTypes = {
  style: PropTypes.object
};

export default function PendingStatus({ style }) {
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
      <div>Your attempt has been successfully submitted!</div>
      <div>{`Please wait until it's reviewed by the administrator`}</div>
      <div>This may take a couple of days</div>
    </div>
  );
}
