import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMyState } from 'helpers/hooks';
import EmailVerifier from './EmailVerifier';
import TaskComplete from '../components/TaskComplete';
import ErrorBoundary from 'components/ErrorBoundary';

Email.propTypes = {
  taskId: PropTypes.number.isRequired
};

export default function Email({ taskId }) {
  const { verifiedEmail, emailMissionAttempted } = useMyState();
  const conditionPassed = useMemo(() => !!verifiedEmail, [verifiedEmail]);
  const passMessage = useMemo(
    () =>
      emailMissionAttempted
        ? 'Congratulations on successfully setting up your own email address!'
        : `It looks like you already have an email address!`,
    [emailMissionAttempted]
  );

  return (
    <ErrorBoundary
      componentPath="MissionModule/Email"
      style={{ width: '100%' }}
    >
      {conditionPassed ? (
        <TaskComplete taskId={taskId} passMessage={passMessage} />
      ) : (
        <EmailVerifier />
      )}
    </ErrorBoundary>
  );
}
