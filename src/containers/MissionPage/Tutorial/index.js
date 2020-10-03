import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StartTutorialPanel from './StartTutorialPanel';
import InteractiveContent from 'components/InteractiveContent';
import { useMyState } from 'helpers/hooks';

Tutorial.propTypes = {
  style: PropTypes.object,
  tutorialId: PropTypes.number,
  tutorialIsPublished: PropTypes.bool
};

export default function Tutorial({ style, tutorialId, tutorialIsPublished }) {
  const [started, setStarted] = useState(false);
  const { canEdit } = useMyState();
  return (
    <div
      style={{
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
        ...style
      }}
    >
      {canEdit && !tutorialIsPublished && <div>Add a New Tutorial</div>}
      {tutorialIsPublished && (
        <>
          {!started && (
            <StartTutorialPanel onStartClick={() => setStarted(true)} />
          )}
          {started && <InteractiveContent interactiveId={tutorialId} />}
        </>
      )}
    </div>
  );
}
