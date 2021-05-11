import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { useMyState } from 'helpers/hooks';
import { panel } from './Styles';

export default function NextMilestone() {
  const { userId } = useMyState();
  return userId ? (
    <ErrorBoundary>
      <div className={panel}>This is your next milestone</div>
    </ErrorBoundary>
  ) : null;
}
