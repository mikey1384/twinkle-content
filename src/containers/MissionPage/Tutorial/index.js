import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StartPanel from './StartPanel';
import InteractiveContent from 'components/InteractiveContent';

Tutorial.propTypes = {
  style: PropTypes.object,
  tutorialId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function Tutorial({ style, tutorialId }) {
  const [started, setStarted] = useState(true);
  return (
    <div
      style={{
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
        ...style
      }}
    >
      {!started && <StartPanel onStartClick={() => setStarted(true)} />}
      {started && <InteractiveContent interactiveId={tutorialId} />}
    </div>
  );
}
