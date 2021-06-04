import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import CodingExercises from './CodingExercises';

HelloWorld.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function HelloWorld({ task, onSetMissionState }) {
  const { code, exerciseSuccessStatus = {} } = task;

  return (
    <ErrorBoundary
      className={css`
        width: 100%;
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
          font-size: 2rem;
          font-weight: bold;
        }
      `}
    >
      <CodingExercises
        code={code}
        exerciseSuccessStatus={exerciseSuccessStatus}
        onSetMissionState={onSetMissionState}
        onSetSuccess={() =>
          onSetMissionState({
            missionId: task.id,
            newState: { success: true }
          })
        }
        onSetCode={(code) =>
          onSetMissionState({
            missionId: task.id,
            newState: { code }
          })
        }
        taskId={task.id}
      />
    </ErrorBoundary>
  );
}
