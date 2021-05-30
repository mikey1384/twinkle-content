import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import FirstCodingExercise from './FirstCodingExercise';

CodingHelloWorld.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CodingHelloWorld({ code, onSetCode, style }) {
  const [readIntro, setReadIntro] = useState(false);

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
          display: flex;
          flex-direction: column;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        style={{ marginTop: '2rem' }}
      >
        {`Everything you did up to this point was kind of like preparing a canvas before painting a picture. Replit is our "canvas," and now it's time to "paint" our website. We do this by telling the computer what to do using a language it can understand. This is called "coding" or "programming" and the computer language we are going to use to code our website is called "Javascript."`}
      </div>
      {!readIntro && (
        <div
          style={{
            marginTop: '5rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button skeuomorphic color="green" onClick={() => setReadIntro(true)}>
            Teach me how to code
          </Button>
        </div>
      )}
      {readIntro && (
        <FirstCodingExercise
          style={{ marginTop: '3rem' }}
          code={code}
          onSetCode={onSetCode}
        />
      )}
    </ErrorBoundary>
  );
}
