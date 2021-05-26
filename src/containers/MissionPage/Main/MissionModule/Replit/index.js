import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ReplitVerifier from './ReplitVerifier';
import DidNotPassCopyAndPaste from './DidNotPassCopyAndPaste';
import { useMissionContext } from 'contexts';

Replit.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function Replit({ task, onSetMissionState }) {
  const {
    state: { missionTypeIdHash, myAttempts }
  } = useMissionContext();
  const copyAndPasteId = useMemo(
    () => missionTypeIdHash['copy-and-paste'],
    [missionTypeIdHash]
  );
  const myCopyAndPasteAttempt = useMemo(
    () => myAttempts[copyAndPasteId],
    [copyAndPasteId, myAttempts]
  );
  const copyAndPasteAttemptPassed = useMemo(
    () => myCopyAndPasteAttempt?.status === 'pass',
    [myCopyAndPasteAttempt?.status]
  );

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      {!copyAndPasteAttemptPassed && <DidNotPassCopyAndPaste />}
      {copyAndPasteAttemptPassed && (
        <ReplitVerifier task={task} onSetMissionState={onSetMissionState} />
      )}
    </ErrorBoundary>
  );
}