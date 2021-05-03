import React from 'react';
import PropTypes from 'prop-types';

EmailExists.propTypes = {
  emailMissionAttempted: PropTypes.bool
};

export default function EmailExists({ emailMissionAttempted }) {
  return (
    <div>
      <div>email exists {emailMissionAttempted}</div>
    </div>
  );
}
