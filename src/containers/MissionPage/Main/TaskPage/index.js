import React from 'react';
import PropTypes from 'prop-types';
import GoBack from 'components/GoBack';
import Task from './Task';
import Tutorial from '../Tutorial';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';

TaskPage.propTypes = {
  match: PropTypes.object.isRequired,
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function TaskPage({
  match: {
    path,
    params: { taskType }
  },
  mission,
  onSetMissionState
}) {
  console.log(path, taskType);
  return (
    <div style={{ width: '100%' }}>
      <GoBack to="./" text="Users" />
      <Task
        style={{ width: '100%' }}
        mission={mission}
        onSetMissionState={onSetMissionState}
      />
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
    </div>
  );
}
