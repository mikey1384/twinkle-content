import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from './TakeScreenshot';
import CopyAndPaste from './CopyAndPaste';
import Googling from './Googling';
import Grammar from './Grammar';
import TwinkleStore from './TwinkleStore';
import Email from './Email';

MissionModule.propTypes = {
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  isRepeating: PropTypes.bool,
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func,
  style: PropTypes.object
};

export default function MissionModule({
  mission,
  fileUploadComplete,
  fileUploadProgress,
  isRepeating,
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
      {mission.missionType === 'twinkle-store' && (
        <TwinkleStore mission={mission} />
      )}
      {mission.missionType === 'google' && (
        <Googling mission={mission} onSetMissionState={onSetMissionState} />
      )}
      {mission.missionType === 'copy-and-paste' && (
        <CopyAndPaste mission={mission} onSetMissionState={onSetMissionState} />
      )}
      {mission.missionType === 'grammar' && (
        <Grammar mission={mission} isRepeating={isRepeating} />
      )}
      {mission.missionType === 'email' && (
        <Email
          isTask
          taskId={mission.id}
          onSetMissionState={onSetMissionState}
        />
      )}
    </div>
  );
}
