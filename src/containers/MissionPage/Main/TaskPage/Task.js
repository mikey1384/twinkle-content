import React from 'react';
import PropTypes from 'prop-types';
import MissionModule from '../MissionModule';
import ErrorBoundary from 'components/ErrorBoundary';
import { panel } from '../../Styles';

Task.propTypes = {
  task: PropTypes.object,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Task({
  task,
  task: { fileUploadComplete, fileUploadProgress },
  onSetMissionState,
  style
}) {
  return (
    <ErrorBoundary
      className={panel}
      style={{
        paddingBottom: '2.5rem',
        ...style
      }}
    >
      <MissionModule
        mission={task}
        fileUploadComplete={fileUploadComplete}
        fileUploadProgress={fileUploadProgress}
        onSetMissionState={onSetMissionState}
      />
    </ErrorBoundary>
  );
}
