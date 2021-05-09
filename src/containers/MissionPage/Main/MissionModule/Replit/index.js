import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';

export default function Replit() {
  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <div>this is replit mission</div>
    </ErrorBoundary>
  );
}
