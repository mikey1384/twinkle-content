import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Questions from './Questions';
import StartScreen from './StartScreen';
import TryAgain from './TryAgain';
import { useAppContext, useMissionContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Grammar.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function Grammar({ mission }) {
  const mounted = useRef(true);
  const { userId } = useMyState();
  const {
    requestHelpers: { loadMission }
  } = useAppContext();
  const {
    actions: { onLoadMission }
  } = useMissionContext();
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    mounted.current = true;
    return function nUnmount() {
      mounted.current = false;
    };
  }, []);

  return (
    <div>
      {!started && (
        <StartScreen
          numQuestions={mission.numQuestions}
          onInitMission={handleInitMission}
          onStartButtonClick={() => setStarted(true)}
        />
      )}
      {started && !failed && (
        <Questions mission={mission} onFail={() => setFailed(true)} />
      )}
      {started && failed && (
        <TryAgain
          onInitMission={handleInitMission}
          onTryAgain={() => setFailed(false)}
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
