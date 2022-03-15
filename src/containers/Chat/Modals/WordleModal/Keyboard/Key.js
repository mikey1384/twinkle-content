import React from 'react';
import PropTypes from 'prop-types';
import { MAX_WORD_LENGTH, REVEAL_TIME_MS } from '../constants/settings';

Key.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  width: PropTypes.number,
  onClick: PropTypes.func,
  isRevealing: PropTypes.bool
};

export function Key({ children, width = 40, value, onClick, isRevealing }) {
  const keyDelayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;

  return (
    <button
      style={{
        transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
        width: `${width}px`,
        height: '58px'
      }}
      onClick={handleClick}
    >
      {children || value}
    </button>
  );

  function handleClick(event) {
    onClick(value);
    event.currentTarget.blur();
  }
}
