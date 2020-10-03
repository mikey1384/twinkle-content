import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StartTutorialPanel from './StartTutorialPanel';
import InteractiveContent from 'components/InteractiveContent';

Tutorial.propTypes = {
  style: PropTypes.object,
  tutorialId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function Tutorial({ style, tutorialId }) {
  const [started, setStarted] = useState(false);
  return (
    <div
      style={{
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
        ...style
      }}
    >
      {!started && <StartTutorialPanel onStartClick={() => setStarted(true)} />}
      {started && <InteractiveContent interactiveId={tutorialId} />}
    </div>
  );
}
