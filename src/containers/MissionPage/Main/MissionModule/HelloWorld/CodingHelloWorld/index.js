import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CodeSandBox from './CodeSandBox';

CodingHelloWorld.propTypes = {
  style: PropTypes.object
};

export default function CodingHelloWorld({ style }) {
  return (
    <ErrorBoundary style={style}>
      <p>{`2. Let's code your first Hello World`}</p>
      <CodeSandBox />
    </ErrorBoundary>
  );
}
