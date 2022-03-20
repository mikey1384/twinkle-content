import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color } from 'constants/css';
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
      return Color.limeGreen();
    }
    if (status === 'present') {
      return Color.brownOrange();
    }
    return Color.blueGray();
  }, [status]);
  const backgroundColor = useMemo(() => {
    if (status === 'correct') {
      return Color.limeGreen();
    }
    if (status === 'present') {
      return Color.brownOrange();
    }
    if (status === 'absent') {
      return Color.blueGray();
    }
    if (value) {
      return Color.lightBlueGray();
    }
    return null;
  }, [status, value]);

  return (
    <div
      style={{
        borderRadius,
        width: '3.7rem',
        height: '3.7rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#fff',
        border: `1px solid ${borderColor}`,
        marginRight: '0.5rem',
        backgroundColor,
        animationDelay,
        ...(status ? { textShadow: 'rgb(0, 0, 0) 1px 1px 1px' } : {})
      }}
    >
      <div style={{ animationDelay }}>{value}</div>
    </div>
  );
}
