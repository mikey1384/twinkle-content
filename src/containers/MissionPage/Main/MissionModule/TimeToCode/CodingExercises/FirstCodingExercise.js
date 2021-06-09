import React from 'react';
import PropTypes from 'prop-types';
import ExerciseContainer from './ExerciseContainer';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired
};

export default function FirstCodingExercise({ code, onSetCode }) {
  return <ExerciseContainer index={0} code={code} onSetCode={onSetCode} />;
}
