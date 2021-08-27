import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Questions from './Questions';
import StartScreen from './StartScreen';
import TryAgain from './TryAgain';
import { useAppContext, useMissionContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Grammar.propTypes = {
  isRepeating: PropTypes.bool,
  mission: PropTypes.object.isRequired
};

export default function Grammar({ isRepeating, mission }) {
  const mounted = useRef(true);
  const { userId } = useMyState();
  const {
    requestHelpers: { loadMission }
  } = useAppContext();
  const {
    state: { myAttempts },
    actions: { onSetMissionState, onSetMyMissionAttempts }
  } = useMissionContext();
  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
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
      {mission.started && !mission.failed && (
        <Questions
          isRepeating={isRepeating}
          mission={mission}
          onFail={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: {
                failed: true
              }
            })
          }
        />
      )}
      {mission.started && mission.failed && (
        <TryAgain
          isRepeating={isRepeating}
          onInitMission={handleInitMission}
          onTryAgain={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: {
                failed: false,
                grammarReviewLoaded: false
              }
            })
          }
        />
      )}
    </div>
  );

  async function handleInitMission() {
    if (userId) {
      const { page, myAttempts } = await loadMission({ missionId: mission.id });
      if (mounted.current) {
        onSetMissionState({
          missionId: mission.id,
          newState: {
            ...page,
            managementTab: mission.managementTab
          }
        });
      }
      if (mounted.current) {
        onSetMyMissionAttempts(myAttempts);
      }
    }
  }
}
