import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';
import Icon from 'components/Icon';

InsertSlide.propTypes = {
  style: PropTypes.object
};

export default function InsertSlide({ style }) {
  return (
    <div
      className={`unselectable ${css`
        &:hover {
          font-weight: bold;
        }
      `}`}
      style={{
        padding: '0.5rem',
        background: '#fff',
        textAlign: 'center',
        border: `1px solid ${Color.borderGray()}`,
        cursor: 'pointer',
        ...style
      }}
      onClick={handleInsertSlide}
    >
      <Icon icon="plus" />
      <span style={{ marginLeft: '0.7rem', fontSize: '1.2rem' }}>
        Insert a slide
      </span>
    </div>
  );

  function handleInsertSlide() {
    console.log('clicked');
  }
}
