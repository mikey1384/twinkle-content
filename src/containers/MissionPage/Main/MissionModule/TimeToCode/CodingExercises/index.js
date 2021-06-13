import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ExerciseContainer from './ExerciseContainer';
import exercises from './exercises';
import { useMyState } from 'helpers/hooks';

CodingExercises.propTypes = {
  codeObj: PropTypes.object,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object,
  taskType: PropTypes.string.isRequired
};

const exerciseKeys = Object.keys(exercises);

export default function CodingExercises({
  codeObj,
  onSetCode,
  style,
  taskType
}) {
  const { state = {} } = useMyState();
  const allPassed = useMemo(() => {
    let passed = true;
    for (let key of exerciseKeys) {
      if (state?.missions?.[taskType]?.[key] !== 'pass') {
        passed = false;
      }
    }
    return passed;
  }, [state, taskType]);

  return (
    <ErrorBoundary
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        ...style
      }}
    >
      {exerciseKeys.map((exerciseKey, index) => (
        <ExerciseContainer
          key={exerciseKey}
          index={index}
          exerciseKey={exerciseKey}
          prevExerciseKey={index === 0 ? null : exerciseKeys[index - 1]}
          codeObj={codeObj}
          onSetCode={onSetCode}
          taskType={taskType}
          style={{ marginTop: index === 0 ? 0 : '10rem' }}
        />
      ))}
      {allPassed && <div>you passed em all</div>}
    </ErrorBoundary>
  );
}
