import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import FirstCodingExercise from './FirstCodingExercise';

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
      <p>{`1. Time to code`}</p>
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
        Change the color of the <b style={{ color: 'red' }}>red</b> button below
        to <b style={{ color: 'blue' }}>blue</b>
      </div>
      <FirstCodingExercise
        style={{ marginTop: '3rem' }}
        code={code}
        onSetCode={onSetCode}
      />
    </ErrorBoundary>
  );
}
