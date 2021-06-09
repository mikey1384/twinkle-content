import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SuccessMessage from './SuccessMessage';
import FailMessage from './FailMessage';
import Icon from 'components/Icon';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import useExercises from './useExercises';

ExerciseContainer.propTypes = {
  code: PropTypes.string,
  index: PropTypes.number.isRequired,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function ExerciseContainer({
  index,
  code,
  onSetCode,
  passed,
  style
}) {
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const { userId, state = {} } = useMyState();
  const [errorMsg, setErrorMsg, success, ...exercises] = useExercises({
    state,
    onUpdateProfileInfo,
    updateMissionStatus,
    userId
  });
  return (
    <ErrorBoundary
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
    >
      <p>
        {exercises[index].title}
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
        {exercises[index].instruction}
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
          code={code || exercises[index].initialCode}
          onSetCode={(code) =>
            onSetCode({ code, exerciseLabel: 'changeButtonColor' })
          }
          onRunCode={exercises[index].onRunCode}
          onSetErrorMsg={setErrorMsg}
          hasError={!!errorMsg}
          passed={passed || success}
          runButtonLabel="check"
        />
        {success && !passed && (
          <SuccessMessage onNextClick={exercises[index].onNextClick} />
        )}
        {errorMsg && <FailMessage message={errorMsg} />}
      </div>
    </ErrorBoundary>
  );
}
