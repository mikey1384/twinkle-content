import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SuccessMessage from './SuccessMessage';
import FailMessage from './FailMessage';
import Icon from 'components/Icon';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

ExerciseContainer.propTypes = {
  code: PropTypes.string,
  errorMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string.isRequired,
  passed: PropTypes.bool.isRequired,
  initialCode: PropTypes.string,
  instruction: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onNextClick: PropTypes.func.isRequired,
  onSetCode: PropTypes.func.isRequired,
  onSetErrorMsg: PropTypes.func.isRequired,
  onRunCode: PropTypes.func.isRequired,
  success: PropTypes.bool
};

export default function ExerciseContainer({
  code,
  errorMsg,
  passed,
  title,
  initialCode,
  instruction,
  onSetCode,
  onSetErrorMsg,
  onNextClick,
  onRunCode,
  success
}) {
  return (
    <ErrorBoundary>
      <p>
        {title}
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
        {instruction}
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
          code={code || initialCode}
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
