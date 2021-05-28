import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

CodingHelloWorld.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CodingHelloWorld({ code, onSetCode, style }) {
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
      <p>{`2. Let's code`}</p>
      <div
        className={css`
          width: 70%;
          margin-top: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            margin-top: 1.5rem;
          }
        `}
      >
        <CodeSandbox
          code={code}
          onSetCode={onSetCode}
          onRunCode={handleRunCode}
        />
      </div>
    </ErrorBoundary>
  );

  async function handleRunCode() {
    console.log('ok');
  }
}
