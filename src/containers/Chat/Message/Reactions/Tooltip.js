import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';
import { css } from '@emotion/css';
import { createPortal } from 'react-dom';

Tooltip.propTypes = {
  parentContext: PropTypes.object.isRequired,
  zIndex: PropTypes.number
};

export default function Tooltip({ parentContext }) {
  const { x, y, width, height } = parentContext;
  const displaysToTheRight = useMemo(() => {
    return window.innerWidth / 2 - x > 0;
  }, [x]);
  const isReversed = useMemo(() => {
    return window.innerHeight / 2 - y < 0;
  }, [y]);

  return createPortal(
    <ErrorBoundary
      style={{
        zIndex: 100 * 1000 * 1000,
        top: 0,
        position: 'fixed'
      }}
    >
      <div
        className={css`
          position: absolute;
          left: ${`${
            displaysToTheRight ? `${x}px` : `CALC(${x}px + ${width}px)`
          }`};
          top: ${isReversed
            ? `CALC(${y}px - 0.5rem)`
            : `CALC(${y}px + ${height}px + 0.5rem)`};
          transform: translate(
            ${displaysToTheRight ? 0 : '-100%'},
            ${isReversed ? '-100%' : 0}
          );
          border: none;
          position: absolute;
          background: #fff;
          box-shadow: 1px 1px 2px ${Color.black(0.6)};
          font-weight: normal;
        `}
      >
        Tooltip Here
      </div>
    </ErrorBoundary>,
    document.getElementById('outer-layer')
  );
}
