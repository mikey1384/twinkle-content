import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ExerciseContainer from './ExerciseContainer';

CodingExercises.propTypes = {
  codeObj: PropTypes.object,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

const exerciseKeys = [
  'changeButtonColor',
  'changeButtonLabel',
  'changeAlertMsg'
];

export default function CodingExercises({ codeObj, onSetCode, style }) {
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
          exerciseKey={exerciseKey}
          prevExerciseKey={index === 0 ? null : exerciseKeys[index - 1]}
          codeObj={codeObj}
          onSetCode={onSetCode}
          style={{ marginTop: index === 0 ? 0 : '10rem' }}
        />
      ))}
    </ErrorBoundary>
  );
}
