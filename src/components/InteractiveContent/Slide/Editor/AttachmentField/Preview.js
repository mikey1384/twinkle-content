import React from 'react';
import PropTypes from 'prop-types';

Preview.propTypes = {
  previewUri: PropTypes.string.isRequired
};

export default function Preview({ previewUri }) {
  return <img src={previewUri} />;
}
