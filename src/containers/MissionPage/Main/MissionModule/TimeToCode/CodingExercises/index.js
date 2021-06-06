import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FirstCodingExercise from './FirstCodingExercise';
import { useMyState } from 'helpers/hooks';
import SecondCodingExercise from './SecondCodingExercise';
import ThirdCodingExercise from './ThirdCodingExercise';

CodingExercises.propTypes = {
  codeObj: PropTypes.object,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CodingExercises({ codeObj, onSetCode, style }) {
  const { state } = useMyState();
  const firstExercisePassed = useMemo(
    () => state?.missions?.['time-to-code']?.changeButtonColor === 'pass',
    [state?.missions]
  );
  const secondExercisePassed = useMemo(
    () => state?.missions?.['time-to-code']?.changeButtonLabel === 'pass',
    [state?.missions]
  );
  const thirdExercisePassed = useMemo(
    () => state?.missions?.['time-to-code']?.changeAlertMsg === 'pass',
    [state?.missions]
  );

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
        passed={firstExercisePassed}
        code={codeObj.changeButtonColor}
        onSetCode={onSetCode}
      />
      {firstExercisePassed && (
        <SecondCodingExercise
          passed={secondExercisePassed}
          code={codeObj.changeButtonLabel}
          onSetCode={onSetCode}
          style={{ marginTop: '5rem' }}
        />
      )}
      {secondExercisePassed && (
        <ThirdCodingExercise
          passed={thirdExercisePassed}
          code={codeObj.changeAlertMsg}
          onSetCode={onSetCode}
          style={{ marginTop: '5rem' }}
        />
      )}
    </ErrorBoundary>
  );
}
