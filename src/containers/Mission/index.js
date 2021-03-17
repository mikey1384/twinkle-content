import React, { useEffect, useRef, useState } from 'react';
import Cover from './Cover';
import CurrentMission from './CurrentMission';
import MissionList from './MissionList';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import RepeatableMissions from './RepeatableMissions';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useMissionContext } from 'contexts';

export default function Mission() {
  const [loading, setLoading] = useState(false);
  const { currentMissionId, userId, isCreator } = useMyState();
  const {
    requestHelpers: { loadMissionList }
  } = useAppContext();
  const {
    state: { missions, missionObj, prevUserId, listLoaded },
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
    if (!listLoaded || userId !== prevUserId) {
      init();
    }

    async function init() {
      setLoading(true);
      const { missions, loadMoreButton } = await loadMissionList();
      if (mounted.current) {
        let displayedMissions = missions;
        if (!isCreator) {
          displayedMissions = missions.filter((mission) => !mission.isHidden);
        }
        setLoading(false);
        onLoadMissionList({
          missions: displayedMissions,
          loadMoreButton,
          prevUserId: userId
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listLoaded, prevUserId, userId, isCreator]);

  return (
    <ErrorBoundary>
      <div>
        {userId && <Cover missionIds={missions} missionObj={missionObj} />}
        {missions.length === 0 && loading && <Loading />}
        {missions.length > 0 && (
          <div
            className={css`
              margin: 5rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin: 1rem;
              }
            `}
          >
            <div
              className={css`
                display: flex;
                @media (max-width: ${mobileMaxWidth}) {
                  margin-top: 2rem;
                  flex-direction: column;
                }
              `}
            >
              <MissionList
                missions={missions}
                missionObj={missionObj}
                className={css`
                  width: CALC(
                    ${missionObj[currentMissionId] ? '65%' : '80%'} - 5rem
                  );
                  @media (max-width: ${mobileMaxWidth}) {
                    width: 100%;
                  }
                `}
              />
              {missionObj[currentMissionId] && (
                <div
                  className={css`
                    width: 35%;
                    margin-left: 5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      margin-left: 0;
                      margin-top: 3rem;
                      width: 100%;
                    }
                  `}
                >
                  <CurrentMission
                    mission={missionObj[currentMissionId]}
                    missionId={currentMissionId}
                    style={{ width: '100%' }}
                  />
                  {userId && (
                    <RepeatableMissions
                      className={css`
                        margin-top: 2rem;
                        @media (max-width: ${mobileMaxWidth}) {
                          margin-top: 0;
                        }
                      `}
                      missions={missions}
                      missionObj={missionObj}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
