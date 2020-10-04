import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddTutorial from './AddTutorial';
import ViewTutorial from './ViewTutorial';
import InteractiveContent from 'components/InteractiveContent';
import { useMyState } from 'helpers/hooks';

Tutorial.propTypes = {
  missionId: PropTypes.number,
  missionTitle: PropTypes.string,
  style: PropTypes.object,
  tutorialId: PropTypes.number,
  tutorialIsPublished: PropTypes.bool
};

export default function Tutorial({
  missionId,
  missionTitle,
  style,
  tutorialId,
  tutorialIsPublished
}) {
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
      {canEdit && !tutorialId && (
        <AddTutorial missionId={missionId} missionTitle={missionTitle} />
      )}
      {!!tutorialId && tutorialIsPublished && !started && !canEdit && (
        <ViewTutorial
          userCanEdit={canEdit}
          onStartClick={() => setStarted(true)}
        />
      )}
      {(started || canEdit) && (
        <InteractiveContent interactiveId={tutorialId} />
      )}
    </div>
  );
}
