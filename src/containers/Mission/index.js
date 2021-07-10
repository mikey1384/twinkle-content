import React, { useEffect, useRef, useState } from 'react';
import Cover from './Cover';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import Main from './Main';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useMissionContext } from 'contexts';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

export default function Mission() {
  const [loading, setLoading] = useState(false);
  const { currentMissionId, userId, isCreator } = useMyState();
  const {
    requestHelpers: { loadMissionList }
  } = useAppContext();
  const {
    state: { missions, missionObj, myAttempts },
    actions: { onLoadMissionList }
  } = useMissionContext();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    init();

    async function init() {
      setLoading(true);
      const { missions, myAttempts, loadMoreButton } = await loadMissionList();
      if (mounted.current) {
        let displayedMissions = missions;
        if (!isCreator) {
          displayedMissions = missions.filter((mission) => !mission.isHidden);
        }
        setLoading(false);
        onLoadMissionList({
          missions: displayedMissions,
          myAttempts,
          loadMoreButton,
          prevUserId: userId
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isCreator]);

  return (
    <ErrorBoundary>
      <div style={{ width: '100%' }}>
        {userId && (
          <Cover
            missionIds={missions}
            missionObj={missionObj}
            myAttempts={myAttempts}
          />
        )}
        {missions.length === 0 && loading && <Loading />}
        {missions.length > 0 && (
          <Main
            className={css`
              padding-top: 3rem;
              padding-bottom: 3rem;
              display: flex;
              width: 100%;
              @media (max-width: ${mobileMaxWidth}) {
                padding-top: 0;
                padding-bottom: 2rem;
              }
            `}
            userId={userId}
            currentMissionId={currentMissionId}
            missions={missions}
            missionObj={missionObj}
            myAttempts={myAttempts}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
