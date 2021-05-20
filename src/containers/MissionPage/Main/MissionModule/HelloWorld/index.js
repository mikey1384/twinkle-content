import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';

export default function HelloWorld() {
  return (
    <ErrorBoundary>
      <div>this is hello world module</div>
    </ErrorBoundary>
  );
}
