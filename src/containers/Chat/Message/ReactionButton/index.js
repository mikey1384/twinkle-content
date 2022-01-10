import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { css } from '@emotion/css';

ReactionButton.propTypes = {
  style: PropTypes.object
};

export default function ReactionButton({ style }) {
  return (
    <Button
      className={`menu-button ${css`
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      `}`}
      style={style}
      skeuomorphic
    >
      B
    </Button>
  );
}
