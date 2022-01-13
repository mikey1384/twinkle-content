import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Emojis from '../emojis.png';
import Tooltip from './Tooltip';
import { reactionsObj } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { isMobile } from 'helpers';

const deviceIsMobile = isMobile(navigator);

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
  const mouseEntered = useRef(false);
  const ReactionRef = useRef(null);
  const [tooltipContext, setTooltipContext] = useState(null);
  const { profileTheme, userId } = useMyState();
  const userReacted = useMemo(
    () => reactedUserIds.includes(userId),
    [reactedUserIds, userId]
  );

  return (
    <div
      ref={ReactionRef}
      onMouseEnter={handleSetTooltipContext}
      onMouseLeave={handleRemoveTooltipContext}
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
        onClick={handleClick}
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
          className="unselectable"
          style={{
            marginLeft: '0.3rem',
            fontSize: '1.3rem'
          }}
        >
          {reactionCount}
        </span>
      </div>
      {tooltipContext && <Tooltip parentContext={tooltipContext} />}
    </div>
  );

  function handleClick() {
    if (userReacted) {
      return onRemoveReaction();
    }
    onAddReaction();
  }

  function handleSetTooltipContext() {
    if (deviceIsMobile) return;
    mouseEntered.current = true;
    const parentElementDimensions =
      ReactionRef.current?.getBoundingClientRect() || {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    setTooltipContext(parentElementDimensions);
  }

  function handleRemoveTooltipContext() {
    if (deviceIsMobile) return;
    mouseEntered.current = false;
    setTooltipContext(null);
  }
}
