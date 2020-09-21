import React from 'react';
import PropTypes from 'prop-types';

Preview.propTypes = {
  previewUri: PropTypes.string.isRequired
};

export default function Preview({ previewUri }) {
  return (
    <div style={{ marginBottom: '1rem', width: '100%' }}>
      <img src={previewUri} style={{ width: '100%' }} />
    </div>
  );
}
