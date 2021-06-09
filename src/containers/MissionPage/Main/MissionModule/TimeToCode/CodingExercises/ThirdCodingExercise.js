import React from 'react';
import PropTypes from 'prop-types';
import ExerciseContainer from './ExerciseContainer';

ThirdCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function ThirdCodingExercise({ code, onSetCode, style }) {
  return (
    <ExerciseContainer
      index={2}
      code={code}
      onSetCode={onSetCode}
      style={style}
    />
  );
}
