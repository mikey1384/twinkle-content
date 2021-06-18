import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SuccessMessage from './SuccessMessage';
import FailMessage from './FailMessage';
import Icon from 'components/Icon';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { scrollElementToCenter } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import useExercises from './useExercises';

ExerciseContainer.propTypes = {
  codeObj: PropTypes.object,
  exercises: PropTypes.object.isRequired,
  exerciseKey: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  prevExerciseKey: PropTypes.string,
  prevUserId: PropTypes.number,
  onSetCode: PropTypes.func.isRequired,
  onSetPrevUserId: PropTypes.func.isRequired,
  style: PropTypes.object,
  taskType: PropTypes.string
};

export default function ExerciseContainer({
  codeObj,
  exercises,
  exerciseKey,
  index,
  prevExerciseKey,
  onSetCode,
  onSetPrevUserId,
  prevUserId,
  style,
  taskType
}) {
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const { userId, state = {} } = useMyState();
  const { passed, prevPassed, errorMsg, setErrorMsg, success, exercise } =
    useExercises({
      exercises,
      exerciseKey,
      prevExerciseKey,
      codeObj,
      state,
      onUpdateProfileInfo,
      onSetCode,
      updateMissionStatus,
      taskType,
      userId
    });
  const ComponentRef = useRef(null);
  const prevPassedRef = useRef(prevPassed);
  useEffect(() => {
    if (!prevPassedRef.current && prevPassed) {
      scrollElementToCenter(ComponentRef.current, -250);
    }
  }, [exerciseKey, prevPassed]);

  return prevPassed ? (
    <ErrorBoundary>
      <div
        ref={ComponentRef}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ...style
        }}
      >
        <p>
          {index + 1}. {exercise.title}
          {passed && (
            <Icon
              style={{ marginLeft: '1rem' }}
              icon="check"
              color={Color.green()}
            />
          )}
        </p>
        <div
          className={css`
            width: 80%;
            font-size: 1.7rem;
            line-height: 2;
            text-align: center;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          style={{ marginTop: '2rem' }}
        >
          {exercise.instruction}
        </div>
        <div
          className={css`
            margin-top: 2rem;
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          <CodeSandbox
            code={exercise.code || exercise.initialCode}
            initialCode={exercise.initialCode}
            onSetCode={exercise.onSetCode}
            onSetPrevUserId={onSetPrevUserId}
            onRunCode={exercise.onRunCode}
            onSetErrorMsg={setErrorMsg}
            hasError={!!errorMsg}
            passed={passed || success}
            prevUserId={prevUserId}
            runButtonLabel="check"
          />
          {success && !passed && (
            <SuccessMessage onNextClick={exercise.onNextClick} />
          )}
          {errorMsg && <FailMessage message={errorMsg} />}
        </div>
      </div>
    </ErrorBoundary>
  ) : null;
}