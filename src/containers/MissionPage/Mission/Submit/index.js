import React from 'react';
import PropTypes from 'prop-types';
import TakeScreenshot from './TakeScreenshot';

Submit.propTypes = {
  previewUri: PropTypes.string,
  missionId: PropTypes.number,
  missionType: PropTypes.string,
  onSetMissionState: PropTypes.func
};

export default function Submit({
  previewUri,
  missionId,
  missionType,
  onSetMissionState
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {missionType === 'screenshot' && (
        <TakeScreenshot
          previewUri={previewUri}
          missionId={missionId}
          onSetMissionState={onSetMissionState}
        />
      )}
    </div>
  );
}
