import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SuccessMessage from './SuccessMessage';
import FailMessage from './FailMessage';
import Icon from 'components/Icon';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import exercises from './exercises';

ExerciseContainer.propTypes = {
  code: PropTypes.string,
  errorMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  index: PropTypes.number.isRequired,
  passed: PropTypes.bool.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onSetCode: PropTypes.func.isRequired,
  onSetErrorMsg: PropTypes.func.isRequired,
  onRunCode: PropTypes.func.isRequired,
  style: PropTypes.object,
  success: PropTypes.bool
};

export default function ExerciseContainer({
  index,
  code,
  errorMsg,
  passed,
  onSetCode,
  onSetErrorMsg,
  onNextClick,
  onRunCode,
  style,
  success
}) {
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
          onRunCode={onRunCode}
          onSetErrorMsg={onSetErrorMsg}
          hasError={!!errorMsg}
          passed={passed || success}
          runButtonLabel="check"
        />
        {success && !passed && <SuccessMessage onNextClick={onNextClick} />}
        {errorMsg && <FailMessage message={errorMsg} />}
      </div>
    </ErrorBoundary>
  );
}
