import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CodeSandbox from 'components/Forms/CodeSandbox';
import Button from 'components/Button';
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
      <p>{`2. Let's code your first Hello World`}</p>
      <div
        className={css`
          width: 70%;
          margin-top: 2rem;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            margin-top: 1.5rem;
          }
        `}
      >
        <CodeSandbox code={code} onSetCode={onSetCode} />
        <Button filled color="logoBlue" onClick={handleRunCode}>
          Run
        </Button>
        <div id="here"></div>
      </div>
    </ErrorBoundary>
  );

  async function handleRunCode() {
    console.log('ok');
  }
}
