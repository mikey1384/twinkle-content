import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import MissionItem from './MissionItem';
import { css } from '@emotion/css';

RepeatableMissions.propTypes = {
  missions: PropTypes.array.isRequired,
  missionObj: PropTypes.object.isRequired,
  className: PropTypes.string,
  myAttempts: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function RepeatableMissions({
  className,
  missions,
  missionObj,
  myAttempts,
  style
}) {
  const repeatableMissions = useMemo(() => {
    return missions.reduce((prevMissions, currMissionId) => {
      const mission = missionObj[currMissionId];
      if (mission.repeatable && myAttempts[mission.id]?.status === 'pass') {
        return prevMissions.concat(mission);
      }
      return prevMissions;
    }, []);
  }, [missionObj, missions, myAttempts]);

  return repeatableMissions.length > 0 ? (
    <div className={className} style={style}>
      <p
        className={css`
          font-size: 2.5rem;
          font-weight: bold;
        `}
      >
        Repeatable Mission{repeatableMissions.length > 1 ? 's' : ''}
      </p>
      <div>
        {repeatableMissions.map((mission) => (
          <MissionItem
            key={mission.id}
            isRepeatable
            style={{ marginTop: '1rem' }}
            mission={mission}
            showStatus={false}
          />
        ))}
      </div>
    </div>
  ) : null;
}
