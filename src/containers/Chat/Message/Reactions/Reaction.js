import React from 'react';
import PropTypes from 'prop-types';
import Emojis from '../emojis.png';
import { reactionsObj } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { Color, borderRadius } from 'constants/css';

Reaction.propTypes = {
  reaction: PropTypes.string,
  reactionCount: PropTypes.number
};

export default function Reaction({ reaction, reactionCount }) {
  return (
    <div
      style={{
        cursor: 'pointer',
        borderRadius,
        height: '2.3rem',
        padding: '0 0.5rem',
        border: `1px solid ${Color.borderGray()}`,
        background: Color.targetGray(),
        marginRight: '0.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        className={css`
          width: 1.7rem;
          height: 1.7rem;
          background: url(${Emojis}) ${reactionsObj[reaction].position} / 5100%;
        `}
      />
      <span
        style={{
          marginLeft: '0.3rem',
          fontSize: '1.3rem'
        }}
      >
        {reactionCount}
      </span>
    </div>
  );
}
