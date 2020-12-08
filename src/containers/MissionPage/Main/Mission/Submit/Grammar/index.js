import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Questions from './Questions';
import StartScreen from './StartScreen';
import TryAgain from './TryAgain';

Grammar.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function Grammar({ mission }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div>
      {!started && <StartScreen onStartButtonClick={() => setStarted(true)} />}
      {started && !failed && (
        <Questions mission={mission} onFail={() => setFailed(true)} />
      )}
      {started && failed && <TryAgain onTryAgain={() => setFailed(false)} />}
    </div>
  );
}
