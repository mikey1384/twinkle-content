import React, { useState } from 'react';
import Questions from './Questions';
import StartScreen from './StartScreen';

export default function Grammar() {
  const [started, setStarted] = useState(false);
  return (
    <div>
      {!started && <StartScreen onStartButtonClick={() => setStarted(true)} />}
      {started && <Questions />}
    </div>
  );
}
