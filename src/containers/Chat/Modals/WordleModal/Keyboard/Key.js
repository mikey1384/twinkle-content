import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { MAX_WORD_LENGTH, REVEAL_TIME_MS } from '../constants/settings';

Key.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  width: PropTypes.number,
  onClick: PropTypes.func,
  isRevealing: PropTypes.bool,
  status: PropTypes.string
};

export default function Key({
  children,
  width = 40,
  value,
  onClick,
  isRevealing,
  status
}) {
  const keyDelayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;
  const backgroundColor = useMemo(() => {
    if (status === 'present') {
      return Color.orange();
    }
    return null;
  }, [status]);

  return (
    <button
      style={{
        transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
        width: `${width}px`,
        height: '58px',
        backgroundColor
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
