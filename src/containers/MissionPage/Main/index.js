import React from 'react';
import PropTypes from 'prop-types';
import Mission from './Mission';
import Tutorial from './Tutorial';
import Loading from 'components/Loading';

Main.propTypes = {
  canEdit: PropTypes.bool,
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Main({ canEdit, mission, onSetMissionState, style }) {
  return (
    <div style={style}>
      {mission ? (
        <div
          style={{
            width: canEdit ? 'CALC(100% - 25rem)' : '100%',
            ...(canEdit
              ? { margin: '0 3rem 0 18rem' }
              : {
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column'
                })
          }}
        >
          <div style={{ width: '100%' }}>
            <Mission
              style={{ width: '100%' }}
              fileUploadProgress={mission.fileUploadProgress}
              fileUploadComplete={mission.fileUploadComplete}
              missionId={mission.id}
              attachment={mission.attachment}
              description={mission.description}
              subtitle={mission.subtitle}
              missionType={mission.missionType}
              objective={mission.objective}
              onSetMissionState={onSetMissionState}
              title={mission.title}
              status={mission.status}
            />
            <Tutorial
              missionId={mission.id}
              missionTitle={mission.title}
              style={{ marginTop: '5rem', marginBottom: '1rem', width: '100%' }}
              tutorialStarted={mission.tutorialStarted}
              onSetMissionState={onSetMissionState}
              tutorialId={mission.tutorialId}
              tutorialIsPublished={mission.tutorialIsPublished}
            />
          </div>
        </div>
      ) : (
        <Loading text="Loading Mission..." />
      )}
    </div>
  );
}
