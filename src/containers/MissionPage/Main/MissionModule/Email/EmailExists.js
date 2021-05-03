import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';

EmailExists.propTypes = {
  emailMissionAttempted: PropTypes.bool
};

export default function EmailExists({ emailMissionAttempted }) {
  const passMessage = useMemo(
    () =>
      emailMissionAttempted
        ? 'Congratulations on successfully setting up your own email address'
        : `Looks like you already have an email address`,
    [emailMissionAttempted]
  );

  return (
    <ErrorBoundary
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <p>{passMessage}</p>
      <div>email exists</div>
    </ErrorBoundary>
  );
}
