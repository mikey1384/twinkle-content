import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from '../../../MissionModules/TakeScreenshot';
import CopyAndPaste from '../../../MissionModules/CopyAndPaste';
import Googling from '../../../MissionModules/Googling';
import Grammar from '../../../MissionModules/Grammar';
import TwinkleStore from '../../../MissionModules/TwinkleStore';

SingleMission.propTypes = {
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  isRepeating: PropTypes.bool,
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func,
  style: PropTypes.object
};

export default function SingleMission({
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
    </div>
  );
}
