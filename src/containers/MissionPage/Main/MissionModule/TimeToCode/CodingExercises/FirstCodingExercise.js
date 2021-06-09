import React from 'react';
import PropTypes from 'prop-types';
import ExerciseContainer from './ExerciseContainer';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired
};

export default function FirstCodingExercise({ code, onSetCode, passed }) {
  return (
    <ExerciseContainer
      passed={passed}
      index={0}
      code={code}
      onSetCode={onSetCode}
    />
  );
}
