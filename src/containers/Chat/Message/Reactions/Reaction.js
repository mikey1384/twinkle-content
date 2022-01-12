import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Emojis from '../emojis.png';
import { reactionsObj } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { useMyState } from 'helpers/hooks';

Reaction.propTypes = {
  reaction: PropTypes.string,
  reactionCount: PropTypes.number,
  reactedUserIds: PropTypes.array,
  onRemoveReaction: PropTypes.func,
  onAddReaction: PropTypes.func
};

export default function Reaction({
  reaction,
  reactionCount,
  reactedUserIds,
  onRemoveReaction,
  onAddReaction
}) {
  const { profileTheme, userId } = useMyState();
  const userReacted = useMemo(
    () => reactedUserIds.includes(userId),
    [reactedUserIds, userId]
  );

  return (
    <div
      style={{
        cursor: 'pointer',
        borderRadius,
        height: '2.3rem',
        border: `1px solid ${
          userReacted ? Color[profileTheme]() : Color.borderGray()
        }`,
        background: Color.targetGray(),
        marginRight: '0.5rem'
      }}
      onClick={handleClick}
    >
      <div
        style={{
          ...(userReacted ? { background: Color[profileTheme](0.2) } : {}),
          borderRadius: innerBorderRadius,
          width: '100%',
          height: '100%',
          padding: '0 0.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          className={css`
            width: 1.7rem;
            height: 1.7rem;
            background: url(${Emojis}) ${reactionsObj[reaction].position} /
              5100%;
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
    </div>
  );

  function handleClick() {
    if (userReacted) {
      return onRemoveReaction();
    }
    onAddReaction();
  }
}
