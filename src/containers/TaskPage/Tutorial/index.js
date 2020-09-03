import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StartPanel from './StartPanel';
import InteractiveContent from './InteractiveContent';

Tutorial.propTypes = {
  style: PropTypes.object
};

export default function Tutorial({ style }) {
  const [started, setStarted] = useState(false);
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        ...style
      }}
    >
      {!started && <StartPanel onStartClick={() => setStarted(true)} />}
      {started && <InteractiveContent contentId={2} />}
    </div>
  );
}
