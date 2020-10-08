import React from 'react';
import PropTypes from 'prop-types';
import Mission from './Mission';
import Tutorial from './Tutorial';
import Loading from 'components/Loading';

Main.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function Main({ mission, onSetMissionState }) {
  return (
    <>
      {mission ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Mission
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
            style={{ marginTop: '5rem', marginBottom: '1rem' }}
            tutorialStarted={mission.tutorialStarted}
            onSetMissionState={onSetMissionState}
            tutorialId={mission.tutorialId}
            tutorialIsPublished={mission.tutorialIsPublished}
          />
        </div>
      ) : (
        <Loading text="Loading Mission..." />
      )}
    </>
  );
}
