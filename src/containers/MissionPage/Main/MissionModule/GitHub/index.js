import React, { useMemo } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import GitHubVerifier from './GitHubVerifier';
import { useMyState } from 'helpers/hooks';

export default function GitHub() {
  const { githubUsername } = useMyState();
  const conditionPassed = useMemo(() => !!githubUsername, [githubUsername]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      {conditionPassed ? <div>Github exists</div> : <GitHubVerifier />}
    </ErrorBoundary>
  );
}
