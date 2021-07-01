import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';

MultiStepContainer.propTypes = {
  children: PropTypes.node
};

export default function MultiStepContainer({ children }) {
  return (
    <ErrorBoundary>
      <div>{children}</div>
    </ErrorBoundary>
  );
}
