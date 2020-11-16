import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Frame from '../Frame';

DeleteInterface.propTypes = {
  pictures: PropTypes.array.isRequired
};

export default function DeleteInterface({ pictures }) {
  return (
    <ErrorBoundary>
      <div style={{ width: '100%', height: 'auto', display: 'flex' }}>
        {pictures.map((picture, index) => (
          <Frame key={index} picture={picture} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
