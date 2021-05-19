import React from 'react';
import PropTypes from 'prop-types';
import MissionItem from 'components/MissionItem';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

SubMission.propTypes = {
  index: PropTypes.number,
  subMission: PropTypes.object.isRequired,
  missionType: PropTypes.string.isRequired,
  previousSubmissionPassed: PropTypes.bool
};

export default function SubMission({
  index,
  subMission,
  missionType,
  previousSubmissionPassed
}) {
  return (
    <div
      style={{
        marginTop: index === 0 ? 0 : '3rem',
        opacity: index === 0 ? 1 : previousSubmissionPassed ? 1 : 0.2
      }}
    >
      <p
        className={css`
          font-weight: bold;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 2.1rem;
          }
        `}
      >
        {index + 1}. {subMission.title}
      </p>
      <div>
        {subMission.tasks.map((task, index) => (
          <MissionItem
            key={task.id}
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
            missionLink={`/missions/${missionType}/${task.missionType}`}
            mission={task}
          />
        ))}
      </div>
    </div>
  );
}
