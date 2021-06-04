import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FirstCodingExercise from './FirstCodingExercise';
import { useMyState } from 'helpers/hooks';
import SecondCodingExercise from './SecondCodingExercise';

CodingExercises.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CodingExercises({ code, onSetCode, style }) {
  const { status } = useMyState();
  const firstExercisePassed = useMemo(
    () =>
      status?.missions?.['building-a-website']?.changeButtonColor?.status ===
      'pass',
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
        style={{ marginTop: '2rem' }}
        code={code}
        onSetCode={onSetCode}
      />
      {firstExercisePassed && <SecondCodingExercise />}
    </ErrorBoundary>
  );
}
