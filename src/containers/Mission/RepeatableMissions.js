import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

RepeatableMissions.propTypes = {
  missions: PropTypes.array.isRequired,
  missionObj: PropTypes.object.isRequired
};

export default function RepeatableMissions({ missions, missionObj }) {
  const repeatableMissions = useMemo(() => {
    return missions.reduce((prevMissions, currMissionId) => {
      const mission = missionObj[currMissionId];
      if (mission.repeatable && mission.myAttempt.status === 'pass') {
        return prevMissions.concat(mission);
      }
      return prevMissions;
    }, []);
  }, [missionObj, missions]);

  return repeatableMissions.length > 0 ? (
    <div>
      <div>title</div>
      <div>
        {repeatableMissions.map((mission) => (
          <div key={mission.id}>{mission.title}</div>
        ))}
      </div>
    </div>
  ) : null;
}
