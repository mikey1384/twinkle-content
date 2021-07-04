import React, { useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CodeSandbox from 'components/Forms/CodeSandbox';
import defaultCode from './defaultCode';
import { mobileMaxWidth } from 'constants/css';
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
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div>First page</div>
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
