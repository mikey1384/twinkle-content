import React, { useState } from 'react';
import Questions from './Questions';

export default function Grammar() {
  const [started, setStarted] = useState(false);
  return (
    <div>
      {!started && <div onClick={() => setStarted(true)}>Start?</div>}
      {started && <Questions />}
    </div>
  );
}
