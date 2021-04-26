import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius } from 'constants/css';
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
        margin-top: 2rem;
        border-radius: ${borderRadius};
        margin-bottom: -1rem;
      `}
    >
      {subMissions.map((subMission) => (
        <div key={subMission.id}>
          <p>title: {subMission.title}</p>
          <div>
            {subMission.tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                style={{ marginTop: index === 0 ? 0 : '1rem' }}
                parentType={missionType}
                mission={task}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
