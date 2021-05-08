import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import GitHubVerifier from './GitHubVerifier';
import { useMyState } from 'helpers/hooks';
import TaskComplete from '../components/TaskComplete';

GitHub.propTypes = {
  taskId: PropTypes.number.isRequired
};

export default function GitHub({ taskId }) {
  const { githubUsername } = useMyState();
  const conditionPassed = useMemo(() => !!githubUsername, [githubUsername]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      {conditionPassed ? (
        <TaskComplete
          taskId={taskId}
          passMessage="Great job creating your GitHub account!"
        />
      ) : (
        <GitHubVerifier />
      )}
    </ErrorBoundary>
  );
}
