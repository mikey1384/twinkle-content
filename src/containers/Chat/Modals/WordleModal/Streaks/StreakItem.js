import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

StreakItem.propTypes = {
  rank: PropTypes.number.isRequired,
  streak: PropTypes.number.isRequired,
  streakObj: PropTypes.object.isRequired
};

export default function StreakItem({ streak, rank, streakObj }) {
  const rankColor = useMemo(() => {
    return rank === 1
      ? Color.gold()
      : rank === 2
      ? Color.lighterGray()
      : rank === 3
      ? Color.orange()
      : undefined;
  }, [rank]);
  const rankFontSize = useMemo(() => {
    return rank < 5 ? '1.5rem' : '1rem';
  }, [rank]);
  const mobileRankFontSize = useMemo(() => {
    return rank <= 5 ? '1.2rem' : '1rem';
  }, [rank]);

  return (
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
      {streak} {streakObj[streak][0].username}...
    </div>
  );
}
