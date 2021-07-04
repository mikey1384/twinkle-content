import React, { useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CodeSandbox from 'components/Forms/CodeSandbox';
import defaultCode from './defaultCode';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

FinalizeYourCode.propTypes = {
  task: PropTypes.object.isRequired,
  username: PropTypes.string
};

export default function FinalizeYourCode({ task, username }) {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const ComponentRef = useRef(null);
  const initialCode = useMemo(() => defaultCode({ username }), [username]);

  return (
    <ErrorBoundary
      className={css`
        width: 100%;
        font-size: 1.7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        > p {
          font-size: 2rem;
          font-weight: bold;
          line-height: 2;
        }
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 1.5rem;
        }
      `}
    >
      <p>Below is the website code we worked on earlier</p>
      <p>
        Feel free to change it anyway you want before we publish it on the
        internet!
      </p>
      <p>
        Check out the <b style={{ color: Color.green() }}>tutorial</b> if you
        need any help
      </p>
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
    </ErrorBoundary>
  );
}
