import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import GitHubVerifier from './GitHubVerifier';
import TaskComplete from '../components/TaskComplete';
import { useMyState } from 'helpers/hooks';

GitHub.propTypes = {
  task: PropTypes.object.isRequired
};

export default function GitHub({ task }) {
  const { githubUsername } = useMyState();
  const conditionPassed = useMemo(() => !!githubUsername, [githubUsername]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      {conditionPassed ? (
        <TaskComplete
          taskId={task.id}
          passMessage="Great job creating your GitHub account!"
        />
      ) : (
        <GitHubVerifier task={task} />
      )}
    </ErrorBoundary>
  );
}
