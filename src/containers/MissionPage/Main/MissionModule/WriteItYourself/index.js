import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ExerciseContainer from '../components/ExerciseContainer';
import exercises from './exercises';
import TaskComplete from '../components/TaskComplete';
import { useKeyContext } from 'contexts';
import { css } from '@emotion/css';

WriteItYourself.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

const exerciseKeys = Object.keys(exercises);

export default function WriteItYourself({ task, onSetMissionState }) {
  const { codeObj = {} } = task;
  const { missions } = useKeyContext((v) => v.myState);
  const allPassed = useMemo(() => {
    let passed = true;
    for (let key of exerciseKeys) {
      if (missions[task.missionType]?.[key] !== 'pass') {
        passed = false;
        break;
      }
    }
    return passed;
  }, [missions, task.missionType]);

  return (
    <ErrorBoundary
      componentPath="MissionModule/WriteItYourself/index"
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
      {exerciseKeys.map((exerciseKey, index) => (
        <ExerciseContainer
          key={exerciseKey}
          exercises={exercises}
          index={index}
          exerciseKey={exerciseKey}
          prevExerciseKey={index === 0 ? null : exerciseKeys[index - 1]}
          codeObj={codeObj}
          onOpenTutorial={() =>
            onSetMissionState({
              missionId: task.id,
              newState: { tutorialStarted: true }
            })
          }
          onSetCode={({ code, exerciseLabel }) =>
            onSetMissionState({
              missionId: task.id,
              newState: { codeObj: { ...codeObj, [exerciseLabel]: code } }
            })
          }
          prevUserId={task.prevUserId}
          taskType={task.missionType}
          style={{ marginTop: index === 0 ? 0 : '10rem' }}
        />
      ))}
      {allPassed && (
        <TaskComplete
          style={{ marginTop: '10rem' }}
          taskId={task.id}
          passMessage="Congratulations! You are now ready to launch your website"
          passMessageFontSize="2.2rem"
        />
      )}
    </ErrorBoundary>
  );
}
