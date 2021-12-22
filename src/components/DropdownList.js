import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';
import { css } from '@emotion/css';
import { createPortal } from 'react-dom';
import { useOutsideClick } from 'helpers/hooks';

DropdownList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object,
  isReversed: PropTypes.bool,
  direction: PropTypes.string
};

export default function DropdownList({
  children,
  className,
  innerRef,
  style = {},
  isReversed,
  onOutsideClick,
  onHideMenu,
  x,
  y
}) {
  const MenuRef = useRef(null);
  useOutsideClick(MenuRef, () => {
    if (typeof onOutsideClick === 'function') {
      onOutsideClick();
    }
    onHideMenu();
  });
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
          className={`${css`
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            z-index: 10;
            padding: 0;
            transform: translate(-100%, ${isReversed ? '-100%' : 0});
            border: none;
            list-style: none;
            position: absolute;
            background: #fff;
            box-shadow: 1px 1px 2px ${Color.black(0.6)};
            font-weight: normal !important;
            line-height: 1.5;
            li {
              display: inline-block;
              clear: both;
              float: left;
              border-radius: 0 !important;
              border: none !important;
              padding: 1rem;
              text-align: center;
              font-size: 1.5rem;
              color: ${Color.darkerGray()};
              cursor: pointer;
              border-bottom: none !important;
              width: 100%;
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
