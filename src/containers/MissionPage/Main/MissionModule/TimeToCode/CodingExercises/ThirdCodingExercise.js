import React from 'react';
import PropTypes from 'prop-types';
import ExerciseContainer from './ExerciseContainer';

ThirdCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function ThirdCodingExercise({
  code,
  onSetCode,
  passed,
  style
}) {
  return (
    <ExerciseContainer
      passed={passed}
      index={2}
      code={code}
      onSetCode={onSetCode}
      style={style}
    />
  );
}
