import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import GitHubVerifier from './GitHubVerifier';
import TaskComplete from '../components/TaskComplete';
import MultiStepContainer from '../components/MultiStepContainer';
import { useMyState } from 'helpers/hooks';

GitHub.propTypes = {
  taskId: PropTypes.number.isRequired
};

export default function GitHub({ taskId }) {
  const { githubUsername } = useMyState();
  const conditionPassed = useMemo(() => !!githubUsername, [githubUsername]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <MultiStepContainer>
        {conditionPassed ? (
          <TaskComplete
            taskId={taskId}
            passMessage="Great job creating your GitHub account!"
          />
        ) : (
          <GitHubVerifier />
        )}
      </MultiStepContainer>
    </ErrorBoundary>
  );
}
