import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { Color } from 'constants/css';

CodingHelloWorld.propTypes = {
  style: PropTypes.object
};

export default function CodingHelloWorld({ style }) {
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
        style={{
          width: '70%',
          marginTop: '2rem',
          border: `1px solid ${Color.borderGray()}`
        }}
      >
        <CodeSandbox />
      </div>
    </ErrorBoundary>
  );
}
