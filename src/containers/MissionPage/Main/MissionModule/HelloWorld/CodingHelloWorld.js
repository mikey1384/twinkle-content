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
      <p>{`1. Time to code!`}</p>
      <div
        className={css`
          width: 80%;
          font-size: 1.7rem;
          line-height: 2;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        style={{ marginTop: '2rem' }}
      >
        {`Great job setting up a replit. A replit is to a website as a canvas is to a painting. Just as a painting doesn't magically appear after you prepare a canvas, a website like this Twinkle Website doesn't get made automatically after you set up a replit - it needs to be coded, just as a painting needs to be painted.`}
      </div>
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
