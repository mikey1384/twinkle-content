import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useTheme } from 'helpers/hooks';

FilterBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  bordered: PropTypes.bool,
  dropdownButton: PropTypes.node,
  innerRef: PropTypes.func,
  inverted: PropTypes.bool,
  style: PropTypes.object
};

export default function FilterBar({
  color,
  bordered,
  className,
  children,
  innerRef,
  inverted,
  dropdownButton,
  style
}) {
  const {
    alert: { color: alertColor },
    mainFilter: { color: mainFilterColor, opacity: mainFilterOpacity }
  } = useTheme(color);
  const mainFilterActiveColor = Color[mainFilterColor]();
  const FilterBarStyle = useMemo(() => {
    return `${css`
      background: ${inverted
        ? Color[mainFilterColor](mainFilterOpacity)
        : '#fff'};
      height: 6rem;
      margin-bottom: 1rem;
      ${!inverted && bordered
        ? `
        border-top: 1px solid ${Color.borderGray()};
        border-left: 1px solid ${Color.borderGray()};
        border-right: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        `
        : ''};
      display: flex;
      font-size: 1.7rem;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      > .filter-section {
        width: 30%;
        height: 100%;
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: flex-end;
        border-bottom: ${inverted ? '' : `1px solid ${Color.borderGray()}`};
      }
      > .nav-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        width: ${!dropdownButton ? '100%' : '70%'};
        > nav {
          font-family: 'Ubuntu', sans-serif, Arial, Helvetica;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          border-bottom: ${inverted ? '' : `1px solid ${Color.borderGray()}`};
          color: ${inverted ? '#fff' : Color.gray()};
          > a {
            color: ${inverted ? '#fff' : Color.gray()};
            text-decoration: none;
          }
          &.alert {
            color: ${Color[alertColor]()}!important;
          }
        }
        > nav.active {
          background: ${inverted ? mainFilterActiveColor : ''};
          border-bottom: ${inverted
            ? ''
            : `3px solid ${mainFilterActiveColor}`};
          color: ${inverted ? '#fff' : mainFilterActiveColor};
          > a {
            color: ${inverted ? '#fff' : mainFilterActiveColor};
          }
          @media (max-width: ${mobileMaxWidth}) {
            border-bottom: ${inverted
              ? ''
              : `4px solid ${mainFilterActiveColor}`};
          }
        }
        > nav.active.alert {
          border-bottom: 3px solid ${Color[alertColor]()}!important;
        }
        > nav:first-of-type {
          ${!inverted && bordered
            ? 'border-bottom-left-radius: 5px;'
            : ''} @media (max-width: ${mobileMaxWidth}) {
            border-bottom-left-radius: 0;
          }
        }
        > nav:last-child {
          @media (max-width: ${mobileMaxWidth}) {
            border-bottom-right-radius: 0;
          }
          ${!inverted && bordered && !dropdownButton
            ? 'border-bottom-right-radius: 5px;'
            : ''};
        }
        > nav:hover {
          background: ${inverted ? mainFilterActiveColor : ''};
          color: ${inverted ? '#fff' : mainFilterActiveColor};
          border-bottom: ${inverted
            ? ''
            : `3px solid ${mainFilterActiveColor}`};
          &.alert {
            color: ${Color[alertColor]()}!important;
            border-bottom: 3px solid ${Color[alertColor]()}!important;
          }
          > a {
            color: ${inverted ? '#fff' : mainFilterActiveColor};
            font-weight: bold;
          }
        }
      }
      @media (max-width: ${mobileMaxWidth}) {
        height: 5.5rem;
        border-radius: 0;
        border-left: none;
        border-right: none;
      }
    `} ${className}`;
  }, [
    alertColor,
    bordered,
    className,
    dropdownButton,
    inverted,
    mainFilterActiveColor,
    mainFilterColor,
    mainFilterOpacity
  ]);

  return (
    <div style={style} ref={innerRef} className={FilterBarStyle}>
      <div className="nav-section">{children}</div>
      {dropdownButton && <div className="filter-section">{dropdownButton}</div>}
    </div>
  );
}
