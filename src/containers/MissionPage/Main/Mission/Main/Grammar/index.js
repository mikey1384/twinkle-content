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
    actions: { onLoadMission, onSetMissionState }
  } = useMissionContext();
  useEffect(() => {
    mounted.current = true;
    return function nUnmount() {
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
          numQuestions={mission.numQuestions}
          onInitMission={handleInitMission}
          onStartButtonClick={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: {
                started: true
              }
            })
          }
        />
      )}
      {mission.started && !mission.failed && (
        <Questions
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
          onInitMission={handleInitMission}
          onTryAgain={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: {
                failed: false
              }
            })
          }
        />
      )}
    </div>
  );

  async function handleInitMission() {
    if (userId) {
      const data = await loadMission(mission.id);
      if (mounted.current) {
        onLoadMission({
          mission: { ...data, managementTab: mission.managementTab },
          prevUserId: userId
        });
      }
    } else {
      onLoadMission({ mission: { id: mission.id }, prevUserId: userId });
    }
  }
}
