import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';
import { css } from '@emotion/css';
import { createPortal } from 'react-dom';
import { useOutsideClick } from 'helpers/hooks';

DropdownList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dropdownContext: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object,
  direction: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

export default function DropdownList({
  children,
  className,
  dropdownContext,
  innerRef,
  style = {},
  onHideMenu = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {}
}) {
  const MenuRef = useRef(null);
  const { x, y } = useMemo(() => {
    return {
      x: dropdownContext.x,
      y: dropdownContext.y
    };
  }, [dropdownContext]);
  useOutsideClick(MenuRef, () => {
    onHideMenu();
  });
  const displaysToTheRight = useMemo(() => {
    return window.innerWidth / 2 - x > 0;
  }, [x]);
  const isReversed = useMemo(() => {
    return window.innerHeight / 2 - y < 0;
  }, [y]);

  return createPortal(
    <ErrorBoundary
      style={{
        width: '100%',
        zIndex: 9000000,
        top: 0,
        position: 'absolute'
      }}
    >
      <div ref={MenuRef}>
        <ul
          ref={innerRef}
          style={style}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={`${css`
            position: absolute;
            left: ${`${
              displaysToTheRight
                ? `CALC(${x}px + ${dropdownContext.width}px + 1rem)`
                : `CALC(${x}px - 1rem)`
            }`};
            top: ${isReversed
              ? `CALC(${y}px + ${dropdownContext.height}px)`
              : `${y}px`};
            z-index: 10;
            padding: 0;
            transform: translate(
              ${displaysToTheRight ? 0 : '-100%'},
              ${isReversed ? '-100%' : 0}
            );
            border: none;
            list-style: none;
            position: absolute;
            background: #fff;
            box-shadow: 1px 1px 2px ${Color.black(0.6)};
            font-weight: normal;
            line-height: 1.5;
            display: flex;
            flex-direction: column;
            li {
              border-radius: 0;
              border: none;
              padding: 1rem;
              text-align: center;
              font-size: 1.5rem;
              color: ${Color.darkerGray()};
              cursor: pointer;
              border-bottom: none;
              &:hover {
                background: ${Color.highlightGray()};
              }
              a {
                text-decoration: none;
              }
            }
          `} ${className}`}
        >
          {children}
        </ul>
      </div>
    </ErrorBoundary>,
    document.getElementById('outer-layer')
  );
}
