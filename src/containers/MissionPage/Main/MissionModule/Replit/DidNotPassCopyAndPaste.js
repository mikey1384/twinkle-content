import React, { useMemo } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import MissionItem from 'components/MissionItem';
import { css } from '@emotion/css';
import { useMissionContext } from 'contexts';

export default function DidNotPassCopyAndPaste() {
  const {
    state: { missionObj, missionTypeIdHash }
  } = useMissionContext();

  const copyAndPasteMission = useMemo(
    () => missionObj?.[missionTypeIdHash?.['copy-and-paste']],
    [missionObj, missionTypeIdHash]
  );

  return (
    <ErrorBoundary
      className={css`
        width: 100%;
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        > p {
          font-weight: bold;
          font-size: 1.7rem;
        }
      `}
    >
      <h3>You did not pass the Copy and Paste mission, yet</h3>
      {copyAndPasteMission && (
        <MissionItem
          style={{ marginTop: '1rem' }}
          mission={copyAndPasteMission}
        />
      )}
    </ErrorBoundary>
  );
}
