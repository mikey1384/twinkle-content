import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StartPanel from './StartPanel';
import TutorialPanels from './TutorialPanels';

Tutorial.propTypes = {
  style: PropTypes.object
};

export default function Tutorial({ style }) {
  const [started, setStarted] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        ...style
      }}
    >
      {!started && <StartPanel onStartClick={() => setStarted(true)} />}
      {started && <TutorialPanels />}
    </div>
  );
}
