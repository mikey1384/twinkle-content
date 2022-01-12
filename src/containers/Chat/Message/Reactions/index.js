import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Emojis from '../emojis.png';
import { css } from '@emotion/css';
import { reactionsObj } from 'constants/defaultValues';

Reactions.propTypes = {
  reactions: PropTypes.array
};

export default function Reactions({ reactions }) {
  const reactionList = useMemo(() => {
    const result = [];
    if (!reactions) return result;
    for (const reaction of reactions) {
      if (!result.includes(reaction.type)) {
        result.push(reaction.type);
      }
    }
    return result;
  }, [reactions]);

  return (
    <div style={{ height: '2rem', display: 'flex' }}>
      {reactionList.map((reaction) => (
        <div
          key={reaction}
          className={css`
            cursor: pointer;
            width: 2rem;
            height: 2rem;
            background: url(${Emojis}) ${reactionsObj[reaction].position} /
              5100%;
          `}
        />
      ))}
    </div>
  );
}
