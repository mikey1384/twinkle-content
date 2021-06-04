import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FirstCodingExercise from './FirstCodingExercise';
import { useMyState } from 'helpers/hooks';
import SecondCodingExercise from './SecondCodingExercise';

CodingExercises.propTypes = {
  codeObj: PropTypes.object,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CodingExercises({ codeObj, onSetCode, style }) {
  const { status } = useMyState();
  const firstExercisePassed = useMemo(
    () => status?.missions?.['time-to-code']?.changeButtonColor === 'pass',
    [status?.missions]
  );
  const secondExercisePassed = useMemo(
    () => status?.missions?.['time-to-code']?.changeLabel === 'pass',
    [status?.missions]
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
          code={codeObj.changeLabel}
          onSetCode={onSetCode}
          style={{ marginTop: '5rem' }}
        />
      )}
    </ErrorBoundary>
  );
}
