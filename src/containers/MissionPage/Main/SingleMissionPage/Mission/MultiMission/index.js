import React from 'react';
import PropTypes from 'prop-types';
import { borderRadius } from 'constants/css';
import { css } from '@emotion/css';
import MissionItem from './MissionItem';

MultiMission.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function MultiMission({ mission: { tasks } }) {
  return (
    <div
      className={css`
        margin-top: 2rem;
        border-radius: ${borderRadius};
        margin-bottom: -1rem;
      `}
    >
      {tasks.map((task, index) => (
        <MissionItem
          key={task.id}
          style={{ marginTop: index === 0 ? 0 : '1rem' }}
          mission={{
            title: task.title,
            id: task.id,
            subtitle: task.subtitle,
            taskKey: task.key
          }}
        />
      ))}
    </div>
  );
}
