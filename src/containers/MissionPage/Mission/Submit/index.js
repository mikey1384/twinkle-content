import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from './TakeScreenshot';

Submit.propTypes = {
  attachment: PropTypes.object,
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  missionId: PropTypes.number,
  missionType: PropTypes.string,
  onSetMissionState: PropTypes.func
};

export default function Submit({
  attachment,
  missionId,
  missionType,
  fileUploadComplete,
  fileUploadProgress,
  onSetMissionState
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {missionType === 'screenshot' && (
        <TakeScreenshot
          attachment={attachment}
          fileUploadComplete={fileUploadComplete}
          fileUploadProgress={fileUploadProgress}
          missionId={missionId}
          onSetMissionState={onSetMissionState}
        />
      )}
    </div>
  );
}
