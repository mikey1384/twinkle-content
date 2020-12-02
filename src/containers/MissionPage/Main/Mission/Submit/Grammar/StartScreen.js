import React from 'react';
import PropTypes from 'prop-types';

StartScreen.propTypes = {
  onStartButtonClick: PropTypes.func.isRequired
};

export default function StartScreen({ onStartButtonClick }) {
  return (
    <div>
      helo
      <div onClick={onStartButtonClick}>Start?</div>
    </div>
  );
}
