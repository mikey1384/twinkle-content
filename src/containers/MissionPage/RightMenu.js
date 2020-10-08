import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

RightMenu.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

export default function RightMenu({ className, style }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        ...style
      }}
    >
      <div
        className={css`
          position: -webkit-sticky;
          > nav {
            padding: 1rem;
            font-size: 2rem;
            font-weight: bold;
            color: ${Color.gray()};
            &:hover {
              color: ${Color.black()};
            }
          }
        `}
        style={{
          paddingLeft: '1rem',
          position: 'sticky',
          top: '1rem'
        }}
      >
        <nav style={{ cursor: 'pointer' }}>this is right menu</nav>
      </div>
    </div>
  );
}
