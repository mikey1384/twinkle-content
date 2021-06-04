import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FirstCodingExercise from './FirstCodingExercise';
import { useMyState } from 'helpers/hooks';
import SecondCodingExercise from './SecondCodingExercise';

CodingExercises.propTypes = {
  code: PropTypes.string,
  exerciseSuccessStatus: PropTypes.object.isRequired,
  onSetCode: PropTypes.func.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  taskId: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default function CodingExercises({
  code,
  exerciseSuccessStatus,
  onSetCode,
  onSetMissionState,
  taskId,
  style
}) {
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
        success={!!exerciseSuccessStatus?.changeButtonColor}
        passed={firstExercisePassed}
        style={{ marginTop: '2rem' }}
        code={code}
        onSuccess={() =>
          onSetMissionState({
            missionId: taskId,
            newState: {
              exerciseSuccessStatus: {
                ...exerciseSuccessStatus,
                changeButtonColor: true
              }
            }
          })
        }
        onSetCode={onSetCode}
      />
      {firstExercisePassed && <SecondCodingExercise />}
    </ErrorBoundary>
  );
}
