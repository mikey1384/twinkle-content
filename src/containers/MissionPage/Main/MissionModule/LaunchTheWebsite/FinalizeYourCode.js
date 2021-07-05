import React, { useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import CodeSandbox from 'components/Forms/CodeSandbox';
import defaultCode from './defaultCode';
import StepSlide from '../components/StepSlide';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import ErrorBoundary from 'components/ErrorBoundary';

FinalizeYourCode.propTypes = {
  index: PropTypes.number,
  task: PropTypes.object.isRequired,
  username: PropTypes.string
};

export default function FinalizeYourCode({ index, task, username }) {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const ComponentRef = useRef(null);
  const initialCode = useMemo(() => defaultCode({ username }), [username]);

  return (
    <ErrorBoundary
      className={css`
        margin-top: 3rem;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: 2rem;
        }
      `}
    >
      <StepSlide
        index={index}
        title={
          <>
            Below is the website code we worked on earlier.
            <br />
            Feel free to change it anyway you want before we publish it on the
            internet!
            <br /> Check out the{' '}
            <b style={{ color: Color.green() }}>tutorial</b> if you need any
            help.
          </>
        }
      >
        <div
          ref={ComponentRef}
          className={css`
            margin-top: 2rem;
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
        >
          <CodeSandbox
            style={{ marginTop: '5rem' }}
            code={code}
            initialCode={initialCode}
            onSetCode={setCode}
            onSetErrorMsg={setErrorMsg}
            hasError={!!errorMsg}
            prevUserId={task.prevUserId}
            runButtonLabel="check"
          />
        </div>
      </StepSlide>
    </ErrorBoundary>
  );
}
