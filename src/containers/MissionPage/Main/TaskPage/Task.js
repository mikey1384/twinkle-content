import React from 'react';
import PropTypes from 'prop-types';
import MissionModule from '../MissionModule';

Task.propTypes = {
  task: PropTypes.object,
  onSetMissionState: PropTypes.func.isRequired
};

export default function Task({
  task,
  task: { fileUploadComplete, fileUploadProgress },
  onSetMissionState
}) {
  return (
    <div>
      <MissionModule
        mission={task}
        fileUploadComplete={fileUploadComplete}
        fileUploadProgress={fileUploadProgress}
        onSetMissionState={onSetMissionState}
        style={{ marginTop: '4.5rem' }}
      />
    </div>
  );
}
