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

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      {conditionPassed ? (
        <TaskComplete
          taskId={taskId}
          emailMissionAttempted={emailMissionAttempted}
        />
      ) : (
        <EmailVerifier />
      )}
    </ErrorBoundary>
  );
}
