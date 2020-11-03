import React from 'react';
import PropTypes from 'prop-types';
import AddTutorial from './AddTutorial';
import ViewTutorial from './ViewTutorial';
import InteractiveContent from 'components/InteractiveContent';
import ErrorBoundary from 'components/ErrorBoundary';
import { useMyState } from 'helpers/hooks';

Tutorial.propTypes = {
  onSetMissionState: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  mission: PropTypes.object.isRequired
};

export default function Tutorial({
  className,
  onSetMissionState,
  style,
  mission
}) {
  const { canEdit } = useMyState();
  return (
    <ErrorBoundary
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style
      }}
    >
      {canEdit && !mission.tutorialId && (
        <AddTutorial missionId={mission.id} missionTitle={mission.title} />
      )}
      {!!mission.tutorialId &&
        mission.tutorialIsPublished &&
        !mission.tutorialStarted &&
        !mission.myAttempt?.status &&
        !canEdit && (
          <ViewTutorial
            onStartClick={() =>
              onSetMissionState({
                missionId: mission.id,
                newState: { tutorialStarted: true }
              })
            }
          />
        )}
      {!!mission.tutorialId &&
        (mission.tutorialStarted || canEdit || !!mission.myAttempt?.status) && (
          <InteractiveContent
            autoFocus={!canEdit}
            interactiveId={mission.tutorialId}
          />
        )}
    </ErrorBoundary>
  );
}
