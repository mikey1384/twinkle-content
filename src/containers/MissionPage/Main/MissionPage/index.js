import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Mission from './Mission';
import Tutorial from '../Tutorial';
import RepeatMissionAddons from '../RepeatMissionAddons';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

MissionPage.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function MissionPage({ mission, onSetMissionState }) {
  const isRepeatMission = useMemo(() => {
    const repeatMissionTypes = ['grammar'];
    return repeatMissionTypes.includes(mission.missionType);
  }, [mission.missionType]);

  return (
    <div style={{ width: '100%' }}>
      <Mission
        style={{ width: '100%' }}
        mission={mission}
        onSetMissionState={onSetMissionState}
      />
      {isRepeatMission ? (
        <RepeatMissionAddons
          mission={mission}
          onSetMissionState={onSetMissionState}
        />
      ) : (
        <Tutorial
          mission={mission}
          className={css`
            margin-top: 5rem;
            margin-bottom: 1rem;
            width: 100%;
            @media (max-width: ${mobileMaxWidth}) {
              margin-top: 2rem;
            }
          `}
          onSetMissionState={onSetMissionState}
        />
      )}
    </div>
  );
}
