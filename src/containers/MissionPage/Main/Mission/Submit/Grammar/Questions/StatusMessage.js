import React from 'react';
import PropTypes from 'prop-types';

StatusMessage.propTypes = {
  status: PropTypes.string
};

export default function StatusMessage({ status }) {
  return (
    <div>
      <div>this is a status message {status}</div>
    </div>
  );
}
