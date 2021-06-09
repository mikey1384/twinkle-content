import React from 'react';
import PropTypes from 'prop-types';
import ExerciseContainer from './ExerciseContainer';

SecondCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function SecondCodingExercise({
  code,
  onSetCode,
  passed,
  style
}) {
  return (
    <ExerciseContainer
      passed={passed}
      index={1}
      code={code}
      onSetCode={onSetCode}
      style={style}
    />
  );
}
