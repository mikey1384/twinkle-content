import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';

AttemptResult.propTypes = {
  isSolved: PropTypes.bool,
  style: PropTypes.object
};

export default function AttemptResult({ isSolved, style }) {
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
        {isSolved ? (
          <span style={{ color: Color.green() }}>success</span>
        ) : (
          <span style={{ color: Color.rose() }}>fail</span>
        )}
      </div>
    </ErrorBoundary>
  );
}
