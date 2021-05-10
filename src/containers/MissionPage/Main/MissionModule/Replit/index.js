import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import ReplitVerifier from './ReplitVerifier';

export default function Replit() {
  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <ReplitVerifier />
    </ErrorBoundary>
  );
}
