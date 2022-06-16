import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

StreakItem.propTypes = {
  myId: PropTypes.number.isRequired,
  rank: PropTypes.number.isRequired,
  streak: PropTypes.number.isRequired,
  streakObj: PropTypes.object.isRequired
};

export default function StreakItem({ myId, streak, rank, streakObj }) {
  const rankColor = useMemo(() => {
    return rank === 1
      ? Color.gold()
      : rank === 2
      ? Color.lighterGray()
      : rank === 3
      ? Color.orange()
      : undefined;
  }, [rank]);
  const textColor = useMemo(
    () => rankColor || (rank <= 10 ? Color.logoBlue() : Color.darkGray()),
    [rankColor, rank]
  );
  const rankFontSize = useMemo(() => {
    return rank < 5 ? '1.5rem' : '1rem';
  }, [rank]);
  const mobileRankFontSize = useMemo(() => {
    return rank <= 5 ? '1.2rem' : '1rem';
  }, [rank]);
  const imIncluded = useMemo(() => {
    for (let { id } of streakObj[streak]) {
      if (id === myId) {
        return true;
      }
    }
    return false;
  }, [myId, streak, streakObj]);

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: imIncluded && rank > 3 ? Color.highlightGray() : '#fff'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          className={css`
            font-weight: bold;
            font-size: ${rankFontSize};
            width: 3rem;
            margin-right: 1rem;
            text-align: center;
            color: ${rankColor ||
            (rank <= 10 ? Color.logoBlue() : Color.darkGray())};
            @media (max-width: ${mobileMaxWidth}) {
              font-size: ${mobileRankFontSize};
            }
          `}
        >
          {rank ? `#${rank}` : '--'}
        </span>
        {streakObj[streak][0].username}...
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          color: textColor,
          fontWeight: 'bold'
        }}
      >
        <Icon style={{ fontSize: '1.3rem' }} icon="times" />
        <span
          className={css`
            font-size: ${rank === 1 ? '2rem' : rank <= 3 ? '1.7rem' : '1.5rem'};
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.1rem;
            }
          `}
          style={{ marginLeft: '0.5rem' }}
        >
          {addCommasToNumber(streak || 0)}
        </span>
      </div>
    </nav>
  );
}
