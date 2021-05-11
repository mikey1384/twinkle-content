import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import HighXPSubjects from './HighXPSubjects';

export default function Earn() {
  return (
    <ErrorBoundary>
      <HighXPSubjects />
    </ErrorBoundary>
  );
}
