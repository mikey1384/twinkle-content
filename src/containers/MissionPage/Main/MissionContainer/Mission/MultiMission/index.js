import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { borderRadius } from 'constants/css';
import { css } from '@emotion/css';
import SubMission from './SubMission';

MultiMission.propTypes = {
  mission: PropTypes.object.isRequired,
  myAttempts: PropTypes.object.isRequired
};

export default function MultiMission({
  mission: { missionType, subMissions },
  myAttempts
}) {
  const missionProgress = useMemo(() => {
    const result = {};
    for (let i = 0; i < subMissions.length; i++) {
      let passed = true;
      const subMission = subMissions[i];
      for (let task of subMission.tasks) {
        if (myAttempts[task.id]?.status !== 'pass') {
          passed = false;
          break;
        }
      }
      result[i] = { passed };
    }
    return result;
  }, [myAttempts, subMissions]);

  return (
    <div
      className={css`
        margin-top: 3rem;
        border-radius: ${borderRadius};
      `}
    >
      {subMissions.map((subMission, index) => (
        <SubMission
          key={index}
          index={index}
          subMission={subMission}
          missionType={missionType}
          subMissionProgress={missionProgress[index]}
          previousSubmissionPassed={!!missionProgress[index - 1]?.passed}
        />
      ))}
    </div>
  );
}
