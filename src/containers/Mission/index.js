import React, { useEffect, useRef, useState } from 'react';
import Cover from './Cover';
import CurrentMission from './CurrentMission';
import MissionList from './MissionList';
import Loading from 'components/Loading';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useMissionContext } from 'contexts';

export default function Mission() {
  const [loading, setLoading] = useState(false);
  const { currentMissionId, userId } = useMyState();
  const {
    requestHelpers: { loadMissionList }
  } = useAppContext();
  const {
    state: { missions, missionObj },
    actions: { onLoadMissionList }
  } = useMissionContext();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();

    async function init() {
      setLoading(true);
      const { missions, loadMoreButton } = await loadMissionList();
      if (mounted.current) {
        setLoading(false);
        onLoadMissionList({ missions, loadMoreButton });
      }
    }

    return function onUnmount() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {userId && <Cover />}
      {missions.length === 0 && loading && <Loading />}
      {missions.length > 0 && (
        <div
          className={css`
            margin: 5rem;
            @media (max-width: ${mobileMaxWidth}) {
              margin: 2rem;
            }
          `}
        >
          <div
            className={css`
              display: flex;
              @media (max-width: ${mobileMaxWidth}) {
                flex-direction: column;
              }
            `}
          >
            {currentMissionId && (
              <CurrentMission
                missionId={currentMissionId}
                className={css`
                  width: 45%;
                  @media (max-width: ${mobileMaxWidth}) {
                    width: 100%;
                  }
                `}
              />
            )}
            <MissionList
              missions={missions}
              missionObj={missionObj}
              className={css`
                margin-left: 5rem;
                width: CALC(${currentMissionId ? '55%' : '80%'} - 5rem);
                @media (max-width: ${mobileMaxWidth}) {
                  margin-left: 0;
                  margin-top: 3rem;
                  width: 100%;
                }
              `}
            />
          </div>
        </div>
      )}
    </div>
  );
}
