import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Emojis from '../emojis.png';
import Tooltip from './Tooltip';
import { useAppContext } from 'contexts';
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
  const loadProfile = useAppContext((v) => v.requestHelpers.loadProfile);
  const ReactionRef = useRef(null);
  const hideTimerRef = useRef(null);
  const hideTimerRef2 = useRef(null);
  const mounted = useRef(true);
  const [tooltipContext, setTooltipContext] = useState(null);
  const [userObj, setUserObj] = useState({});
  const { profileTheme, userId } = useMyState();
  const userReacted = useMemo(
    () => reactedUserIds.includes(userId),
    [reactedUserIds, userId]
  );

  const reactedUserIdsExcludingMine = useMemo(
    () => reactedUserIds.filter((id) => id !== userId),
    [reactedUserIds, userId]
  );

  useEffect(() => {
    const indexLimit = Math.min(reactedUserIdsExcludingMine.length, 2);
    for (let i = 0; i < indexLimit; i++) {
      handleLoadProfile(reactedUserIdsExcludingMine[i]);
    }

    async function handleLoadProfile(userId) {
      const data = await loadProfile(userId);
      if (mounted.current) {
        setUserObj((prev) => ({ ...prev, [userId]: data }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactedUserIds]);

  const reactedUsersExcludingMe = useMemo(() => {
    const users = [];
    for (let i = 0; i < reactedUserIdsExcludingMine.length; i++) {
      if (userObj[reactedUserIds[i]]) {
        users.push(userObj[reactedUserIds[i]]);
      }
    }
    return users;
  }, [reactedUserIdsExcludingMine.length, userObj, reactedUserIds]);

  const reactedUsers = useMemo(() => {
    const users = [];
    if (userReacted) {
      users.push({
        id: userId,
        username: 'You'
      });
    }
    users.push(...reactedUsersExcludingMe);
    return users;
  }, [userReacted, reactedUsersExcludingMe, userId]);

  useEffect(() => {
    mounted.current = true;

    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  return (
    <div
      ref={ReactionRef}
      style={{
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
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          padding: '0 0.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onMouseEnter={handleSetTooltipContext}
        onMouseLeave={handleRemoveTooltipContext}
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
      {tooltipContext && reactedUsers.length > 0 && (
        <Tooltip
          onMouseEnter={() => {
            clearTimeout(hideTimerRef.current);
            clearTimeout(hideTimerRef2.current);
          }}
          onMouseLeave={() => {
            hideTimerRef2.current = setTimeout(() => {
              if (mounted.current) {
                setTooltipContext(null);
              }
            }, 300);
          }}
          parentContext={tooltipContext}
          reactedUserIds={reactedUserIds}
          displayedReactedUsers={reactedUsers}
        />
      )}
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
    clearTimeout(hideTimerRef.current);
    clearTimeout(hideTimerRef2.current);
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
    hideTimerRef.current = setTimeout(() => {
      if (mounted.current) {
        setTooltipContext(null);
      }
    }, 300);
  }
}
