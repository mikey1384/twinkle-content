import React from 'react';
import PropTypes from 'prop-types';
import AddTutorial from './AddTutorial';
import ViewTutorial from './ViewTutorial';
import InteractiveContent from 'components/InteractiveContent';
import { useMyState } from 'helpers/hooks';

Tutorial.propTypes = {
  missionId: PropTypes.number,
  missionTitle: PropTypes.string,
  onSetMissionState: PropTypes.func,
  style: PropTypes.object,
  tutorialStarted: PropTypes.bool,
  tutorialId: PropTypes.number,
  tutorialIsPublished: PropTypes.bool
};

export default function Tutorial({
  missionId,
  missionTitle,
  onSetMissionState,
  style,
  tutorialId,
  tutorialStarted,
  tutorialIsPublished
}) {
  const { canEdit } = useMyState();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        ...style
      }}
    >
      {canEdit && !tutorialId && (
        <AddTutorial missionId={missionId} missionTitle={missionTitle} />
      )}
      {!!tutorialId && tutorialIsPublished && !tutorialStarted && !canEdit && (
        <ViewTutorial
          onStartClick={() =>
            onSetMissionState({
              missionId,
              newState: { tutorialStarted: true }
            })
          }
        />
      )}
      {(tutorialStarted || canEdit) && (
        <InteractiveContent interactiveId={tutorialId} />
      )}
    </div>
  );
}
