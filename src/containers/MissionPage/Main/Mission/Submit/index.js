import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from './TakeScreenshot';
import CopyAndPaste from './CopyAndPaste';
import Googling from './Googling';

Submit.propTypes = {
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func,
  style: PropTypes.object
};

export default function Submit({
  mission,
  fileUploadComplete,
  fileUploadProgress,
  onSetMissionState,
  style
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {mission.missionType === 'screenshot' && (
        <TakeScreenshot
          attachment={mission.attachment}
          fileUploadComplete={fileUploadComplete}
          fileUploadProgress={fileUploadProgress}
          missionId={mission.id}
          onSetMissionState={onSetMissionState}
        />
      )}
      {mission.missionType === 'google' && (
        <Googling mission={mission} onSetMissionState={onSetMissionState} />
      )}
      {mission.missionType === 'copy-and-paste' && (
        <CopyAndPaste mission={mission} onSetMissionState={onSetMissionState} />
      )}
    </div>
  );
}
