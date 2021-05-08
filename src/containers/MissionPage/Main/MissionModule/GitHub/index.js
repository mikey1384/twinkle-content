import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import GitHubVerifier from './GitHubVerifier';

export default function GitHub() {
  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <GitHubVerifier />
    </ErrorBoundary>
  );
}
