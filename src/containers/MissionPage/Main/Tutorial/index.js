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
  const { isCreator } = useMyState();
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
      {isCreator && !mission.tutorialId && (
        <AddTutorial missionId={mission.id} missionTitle={mission.title} />
      )}
      {(isCreator ||
        (!!mission.tutorialId &&
          mission.tutorialIsPublished &&
          !mission.tutorialStarted &&
          !mission.myAttempt?.status)) && (
        <ViewTutorial
          isCreator={isCreator}
          style={isCreator ? { marginBottom: '5rem' } : {}}
          tutorialPrompt={mission.tutorialPrompt}
          tutorialButtonLabel={mission.tutorialButtonLabel}
          onStartClick={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: { tutorialStarted: true }
            })
          }
        />
      )}
      {!!mission.tutorialId &&
        (mission.tutorialStarted ||
          isCreator ||
          !!mission.myAttempt?.status) && (
          <InteractiveContent
            autoFocus={!isCreator && !mission.myAttempt?.status}
            interactiveId={mission.tutorialId}
          />
        )}
    </ErrorBoundary>
  );
}
