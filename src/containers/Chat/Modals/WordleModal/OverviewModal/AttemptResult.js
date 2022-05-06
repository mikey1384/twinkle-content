import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';

AttemptResult.propTypes = {
  isGameWon: PropTypes.bool,
  style: PropTypes.object
};

export default function AttemptResult({ isGameWon, style }) {
  return (
    <ErrorBoundary
      style={{
        fontWeight: 'bold',
        textAlign: 'center',
        ...style
      }}
    >
      <p style={{ fontSize: '1.7rem' }}>Result</p>
      <div style={{ fontSize: '2rem' }}>
        {isGameWon ? (
          <span style={{ color: Color.green() }}>success</span>
        ) : (
          <span style={{ color: Color.rose() }}>fail</span>
        )}
      </div>
    </ErrorBoundary>
  );
}
