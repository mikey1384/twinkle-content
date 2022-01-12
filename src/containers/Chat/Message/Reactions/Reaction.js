import React from 'react';
import PropTypes from 'prop-types';
import Emojis from '../emojis.png';
import { reactionsObj } from 'constants/defaultValues';
import { css } from '@emotion/css';

Reaction.propTypes = {
  reaction: PropTypes.string
};

export default function Reaction({ reaction }) {
  return (
    <div
      className={css`
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        background: url(${Emojis}) ${reactionsObj[reaction].position} / 5100%;
      `}
    />
  );
}
