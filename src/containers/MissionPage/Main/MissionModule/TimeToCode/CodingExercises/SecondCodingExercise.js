import React from 'react';
import PropTypes from 'prop-types';
import ExerciseContainer from './ExerciseContainer';

SecondCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function SecondCodingExercise({ code, onSetCode, style }) {
  return (
    <ExerciseContainer
      index={1}
      code={code}
      onSetCode={onSetCode}
      style={style}
    />
  );
}
