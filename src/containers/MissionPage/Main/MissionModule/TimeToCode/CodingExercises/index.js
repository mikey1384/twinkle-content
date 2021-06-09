import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ExerciseContainer from './ExerciseContainer';

CodingExercises.propTypes = {
  codeObj: PropTypes.object,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

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
      {Array(3)
        .fill()
        .map((elem, index) => (
          <ExerciseContainer
            key={index}
            codeObj={codeObj}
            index={index}
            onSetCode={onSetCode}
            style={{ marginTop: index === 0 ? 0 : '10rem' }}
          />
        ))}
    </ErrorBoundary>
  );
}
