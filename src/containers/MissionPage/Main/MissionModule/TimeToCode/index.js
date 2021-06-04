import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import CodingExercises from './CodingExercises';

TimeToCode.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function TimeToCode({ task, onSetMissionState }) {
  const { codeObj = {} } = task;

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
        codeObj={codeObj}
        onSetMissionState={onSetMissionState}
        onSetCode={({ code, exerciseLabel }) =>
          onSetMissionState({
            missionId: task.id,
            newState: { codeObj: { ...codeObj, [exerciseLabel]: code } }
          })
        }
      />
    </ErrorBoundary>
  );
}
