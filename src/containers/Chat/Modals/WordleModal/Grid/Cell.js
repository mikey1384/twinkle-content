import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { REVEAL_TIME_MS } from '../constants/settings';

Cell.propTypes = {
  status: PropTypes.string,
  value: PropTypes.string,
  position: PropTypes.number
};

export default function Cell({ status, value, position = 0 }) {
  const animationDelay = `${position * REVEAL_TIME_MS}ms`;
  const borderColor = useMemo(() => {
    if (status === 'correct') {
      return Color.green();
    }
    if (status === 'present') {
      return Color.orange();
    }
    if (status === 'absent') {
      return Color.gray();
    }
    return 'black';
  }, [status]);
  const backgroundColor = useMemo(() => {
    if (status === 'correct') {
      return Color.green();
    }
    if (status === 'present') {
      return Color.orange();
    }
    if (status === 'absent') {
      return Color.gray();
    }
    return null;
  }, [status]);

  return (
    <div
      style={{
        width: '3.5rem',
        height: '3.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#fff',
        border: `1px solid ${borderColor}`,
        marginRight: '0.5rem',
        backgroundColor,
        animationDelay
      }}
    >
      <div style={{ animationDelay }}>{value}</div>
    </div>
  );
}
