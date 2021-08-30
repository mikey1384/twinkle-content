import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';

AttachmentEditSection.propTypes = {
  filePath: PropTypes.string.isRequired
};

export default function AttachmentEditSection({ filePath }) {
  return (
    <ErrorBoundary>
      {filePath ? <div>{filePath}</div> : <div>no file path</div>}
    </ErrorBoundary>
  );
}
