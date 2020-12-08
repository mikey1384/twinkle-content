import React, { useState } from 'react';
import Questions from './Questions';
import StartScreen from './StartScreen';
import TryAgain from './TryAgain';

export default function Grammar() {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div>
      {!started && <StartScreen onStartButtonClick={() => setStarted(true)} />}
      {started && !failed && <Questions onFail={() => setFailed(true)} />}
      {started && failed && <TryAgain onTryAgain={() => setFailed(false)} />}
    </div>
  );
}
