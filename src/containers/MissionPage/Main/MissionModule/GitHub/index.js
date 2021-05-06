import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';

export default function GitHub() {
  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <div>this is github mission</div>
    </ErrorBoundary>
  );
}
