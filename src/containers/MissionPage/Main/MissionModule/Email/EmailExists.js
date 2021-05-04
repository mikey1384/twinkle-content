import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Icon from 'components/Icon';

EmailExists.propTypes = {
  emailMissionAttempted: PropTypes.bool
};

export default function EmailExists({ emailMissionAttempted }) {
  const [submitDisabled] = useState(false);
  const passMessage = useMemo(
    () =>
      emailMissionAttempted
        ? 'Congratulations on successfully setting up your own email address'
        : `It looks like you already have an email address!`,
    [emailMissionAttempted]
  );

  return (
    <ErrorBoundary
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '1.7rem'
      }}
    >
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '1.8rem',
          marginBottom: '1.5rem'
        }}
      >
        {passMessage}
      </p>
      <p>
        Press the <b style={{ color: Color.brownOrange() }}>button</b> below to
        collect your reward
      </p>
      <Button
        filled
        disabled={submitDisabled}
        style={{ marginTop: '3.5rem', fontSize: '1.7rem' }}
        skeuomorphic
        color="brownOrange"
        onClick={handleTaskComplete}
      >
        <Icon icon="bolt" />
        <span style={{ marginLeft: '1rem' }}>Task Complete</span>
      </Button>
    </ErrorBoundary>
  );

  async function handleTaskComplete() {
    console.log('task is complete');
  }
}
