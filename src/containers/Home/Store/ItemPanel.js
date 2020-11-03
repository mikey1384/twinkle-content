import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

ItemPanel.propTypes = {
  style: PropTypes.object
};

export default function ItemPanel({ style }) {
  return (
    <div
      className={css`
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          border-radius: 0;
        }
      `}
      style={{
        border: `1px solid ${Color.borderGray()}`,
        padding: '1rem',
        ...style
      }}
    >
      <div>This is an item</div>
    </div>
  );
}
