import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from './TakeScreenshot';
import CopyAndPaste from './CopyAndPaste';
import Googling from './Googling';
import Grammar from './Grammar';
import TwinkleStore from './TwinkleStore';
import Email from './Email';
import FixingBugs from './FixingBugs';
import GitHub from './GitHub';
import TimeToCode from './TimeToCode';
import Replit from './Replit';

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
      {mission.missionType === 'email' && <Email taskId={mission.id} />}
      {mission.missionType === 'github' && <GitHub taskId={mission.id} />}
      {mission.missionType === 'replit' && (
        <Replit task={mission} onSetMissionState={onSetMissionState} />
      )}
      {mission.missionType === 'time-to-code' && (
        <TimeToCode task={mission} onSetMissionState={onSetMissionState} />
      )}
      {mission.missionType === 'fixing-bugs' && (
        <FixingBugs task={mission} onSetMissionState={onSetMissionState} />
      )}
    </div>
  );
}
