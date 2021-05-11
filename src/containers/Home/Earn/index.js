import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import HighXPSubjects from './HighXPSubjects';
import NextMilestone from './NextMilestone';

export default function Earn() {
  return (
    <ErrorBoundary>
      <NextMilestone />
      <HighXPSubjects style={{ marginTop: '1rem' }} />
    </ErrorBoundary>
  );
}
