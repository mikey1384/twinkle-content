import React from 'react';
import PropTypes from 'prop-types';

Editor.propTypes = {
  tutorialPrompt: PropTypes.string,
  tutorialButtonLabel: PropTypes.string
};

export default function Editor({ tutorialPrompt, tutorialButtonLabel }) {
  return (
    <div>
      <div>{tutorialPrompt}</div>
      <div>{tutorialButtonLabel}</div>
    </div>
  );
}
