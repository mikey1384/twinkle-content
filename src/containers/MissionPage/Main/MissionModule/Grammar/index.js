import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Questions from './Questions';
import StartScreen from './StartScreen';
import { useAppContext, useMissionContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Grammar.propTypes = {
  isRepeating: PropTypes.bool,
  mission: PropTypes.object.isRequired
};

export default function Grammar({ isRepeating, mission }) {
  const { userId } = useMyState();
  const loadMission = useAppContext((v) => v.requestHelpers.loadMission);
  const myAttempts = useMissionContext((v) => v.state.myAttempts);
  const onSetMissionState = useMissionContext(
    (v) => v.actions.onSetMissionState
  );
  const onSetMyMissionAttempts = useMissionContext(
    (v) => v.actions.onSetMyMissionAttempts
  );
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  useEffect(() => {
    return function onUnmount() {
      onSetMissionState({
        missionId: mission.id,
        newState: {
          started: false,
          failed: false
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {!mission.started && (
        <StartScreen
          isRepeating={isRepeating}
          mission={mission}
          myAttempts={myAttempts}
          onInitMission={handleInitMission}
          loading={loading}
          onStartButtonClick={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: {
                started: true,
                grammarReviewLoaded: false
              }
            })
          }
        />
      )}
      {mission.started && (
        <Questions isRepeating={isRepeating} mission={mission} />
      )}
    </div>
  );

  async function handleInitMission() {
    if (userId && !loadingRef.current) {
      loadingRef.current = true;
      setLoading(true);
      const { page, myAttempts } = await loadMission({ missionId: mission.id });
      onSetMissionState({
        missionId: mission.id,
        newState: {
          ...page,
          managementTab: mission.managementTab
        }
      });
      onSetMyMissionAttempts(myAttempts);
      setLoading(false);
      loadingRef.current = false;
    }
  }
}
