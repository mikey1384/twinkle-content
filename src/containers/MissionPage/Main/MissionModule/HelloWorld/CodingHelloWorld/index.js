import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CodeSandbox from 'components/Forms/CodeSandbox';

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
        style={{
          width: '70%',
          marginTop: '2rem'
        }}
      >
        <CodeSandbox code={code} onSetCode={onSetCode} />
      </div>
    </ErrorBoundary>
  );
}
