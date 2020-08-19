import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

ListItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};
export default function ListItem({ children, style }) {
  return (
    <div
      style={style}
      className={css`
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
      `}
    >
      {children}
    </div>
  );
}
