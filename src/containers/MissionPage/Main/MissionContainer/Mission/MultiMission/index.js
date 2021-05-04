import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import TaskItem from './TaskItem';

MultiMission.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function MultiMission({
  mission: { missionType, subMissions }
}) {
  return (
    <div
      className={css`
        margin-top: 3rem;
        border-radius: ${borderRadius};
      `}
    >
      {subMissions.map((subMission, index) => (
        <div key={index} style={{ marginTop: index === 0 ? 0 : '3rem' }}>
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
              <TaskItem
                key={task.id}
                style={{ marginTop: index === 0 ? 0 : '1rem' }}
                parentType={missionType}
                task={task}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
