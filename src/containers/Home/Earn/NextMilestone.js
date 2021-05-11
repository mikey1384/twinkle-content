import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { panel } from './Styles';

export default function NextMilestone() {
  return (
    <ErrorBoundary>
      <div className={panel}>This is your next milestone</div>
    </ErrorBoundary>
  );
}
