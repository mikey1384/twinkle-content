import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FirstCodingExercise from './FirstCodingExercise';
import SecondCodingExercise from './SecondCodingExercise';
import ThirdCodingExercise from './ThirdCodingExercise';

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
      <FirstCodingExercise
        code={codeObj.changeButtonColor}
        onSetCode={onSetCode}
      />
      <SecondCodingExercise
        code={codeObj.changeButtonLabel}
        onSetCode={onSetCode}
        style={{ marginTop: '5rem' }}
      />
      <ThirdCodingExercise
        code={codeObj.changeAlertMsg}
        onSetCode={onSetCode}
        style={{ marginTop: '5rem' }}
      />
    </ErrorBoundary>
  );
}
