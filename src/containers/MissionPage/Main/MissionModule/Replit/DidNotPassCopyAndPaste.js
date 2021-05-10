import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';

export default function DidNotPassCopyAndPaste() {
  return (
    <ErrorBoundary>
      <div>Did not pass copy and paste yet</div>
    </ErrorBoundary>
  );
}
