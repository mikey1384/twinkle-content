import React, { useEffect, useMemo, useState, useRef } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import MissionItem from 'components/MissionItem';
import Loading from 'components/Loading';
import { css } from '@emotion/css';
import { useAppContext, useMissionContext } from 'contexts';

export default function DidNotPassCopyAndPaste() {
  const {
    requestHelpers: { loadMission }
  } = useAppContext();
  const {
    actions: { onLoadMission },
    state: { missionObj, missionTypeIdHash }
  } = useMissionContext();
  const [loading, setLoading] = useState(false);

  const copyAndPasteMission = useMemo(
    () => missionObj?.[missionTypeIdHash?.['copy-and-paste']],
    [missionObj, missionTypeIdHash]
  );

  const mounted = useRef(true);

  useEffect(() => {
    if (!copyAndPasteMission && missionTypeIdHash?.['copy-and-paste']) {
      handleLoadCopyAndPasteMission(missionTypeIdHash?.['copy-and-paste']);
    }
    async function handleLoadCopyAndPasteMission(missionId) {
      setLoading(true);
      const { page } = await loadMission(missionId);
      if (mounted.current) {
        onLoadMission({ mission: page });
      }
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [
    copyAndPasteMission,
    loadMission,
    missionObj,
    missionTypeIdHash,
    onLoadMission
  ]);

  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

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
      {loading ? (
        <Loading />
      ) : (
        <>
          <h3>You did not pass the Copy and Paste mission, yet</h3>
          {copyAndPasteMission && (
            <MissionItem
              style={{ marginTop: '1rem' }}
              mission={copyAndPasteMission}
              missionLink={`/missions/${copyAndPasteMission.missionType}`}
            />
          )}
        </>
      )}
    </ErrorBoundary>
  );
}
