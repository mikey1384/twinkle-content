import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import AddTutorial from './AddTutorial';
import ViewTutorial from './ViewTutorial';
import InteractiveContent from 'components/InteractiveContent';
import ErrorBoundary from 'components/ErrorBoundary';
import { useMyState } from 'helpers/hooks';
import { scrollElementToCenter } from 'helpers';

Tutorial.propTypes = {
  onSetMissionState: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  mission: PropTypes.object.isRequired,
  myAttempts: PropTypes.object.isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default function Tutorial({
  className,
  onSetMissionState,
  style,
  mission,
  myAttempts,
  innerRef
}) {
  const { isCreator } = useMyState();
  const divToCenter = useRef(null);
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
      <div ref={innerRef} />
      <div ref={divToCenter} />
      {isCreator && !mission.tutorialId && (
        <AddTutorial missionId={mission.id} missionTitle={mission.title} />
      )}
      {!!mission.tutorialId &&
        (isCreator ||
          (mission.tutorialIsPublished && !mission.tutorialStarted)) && (
          <ViewTutorial
            isCreator={isCreator}
            missionId={mission.id}
            style={isCreator ? { marginBottom: '5rem' } : {}}
            onSetMissionState={onSetMissionState}
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
      {!!mission.tutorialId && (mission.tutorialStarted || isCreator) && (
        <InteractiveContent
          autoFocus={!isCreator && !myAttempts[mission.id]?.status}
          interactiveId={mission.tutorialId}
          onGoBackToMission={handleGoBackToMission}
        />
      )}
    </ErrorBoundary>
  );

  function handleGoBackToMission() {
    scrollElementToCenter(divToCenter.current);
    onSetMissionState({
      missionId: mission.id,
      newState: { tutorialStarted: false }
    });
  }
}
