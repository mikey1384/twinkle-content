import React from 'react';
import PropTypes from 'prop-types';
import AddTutorial from './AddTutorial';
import ViewTutorial from './ViewTutorial';
import InteractiveContent from 'components/InteractiveContent';
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
    <div
      className={className}
      style={{
        display: 'flex',
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
        mission.myAttempt.status !== 'pass' &&
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
      {(mission.tutorialStarted ||
        canEdit ||
        mission.myAttempt.status === 'pass') && (
        <InteractiveContent interactiveId={mission.tutorialId} />
      )}
    </div>
  );
}
