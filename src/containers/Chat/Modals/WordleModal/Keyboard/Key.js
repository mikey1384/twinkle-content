import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';
import { REVEAL_TIME_MS } from '../constants/settings';

Key.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  width: PropTypes.number,
  onClick: PropTypes.func,
  isRevealing: PropTypes.bool,
  maxWordLength: PropTypes.number,
  status: PropTypes.string
};

export default function Key({
  children,
  width = 40,
  value,
  onClick,
  isRevealing,
  maxWordLength,
  status
}) {
  const keyDelayMs = REVEAL_TIME_MS * maxWordLength;
  const backgroundColor = useMemo(() => {
    if (status === 'correct') {
      return Color.limeGreen();
    }
    if (status === 'present') {
      return Color.brownOrange();
    }
    if (status === 'absent') {
      return Color.darkBlueGray();
    }
    return Color.lightBlueGray();
  }, [status]);

  return (
    <button
      style={{
        borderRadius,
        color: '#fff',
        cursor: 'pointer',
        marginRight: '2px',
        border: 0,
        transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
        width: `${width}px`,
        height: '5.5rem',
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
