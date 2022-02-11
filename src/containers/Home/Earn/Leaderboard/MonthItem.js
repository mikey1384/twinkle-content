import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { useNotiContext } from 'contexts';
import TopRanker from './TopRanker';

export default function MonthItem() {
  const top30sMonthly = useNotiContext((v) => v.state.top30sMonthly);
  const top3 = useMemo(() => {
    return top30sMonthly.slice(0, 3);
  }, [top30sMonthly]);

  return (
    <div
      className={css`
        background: #fff;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
      `}
    >
      <p
        className={css`
          font-size: 2rem;
          font-weight: bold;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.7rem;
          }
        `}
      >
        February
      </p>
      <div
        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
      >
        {top3.map((user, index) => (
          <TopRanker
            key={user.id}
            style={{ marginLeft: index === 0 ? 0 : '1rem' }}
            username={user.username}
            profilePicUrl={user.profilePicUrl}
            userId={user.id}
            rank={user.rank}
          />
        ))}
      </div>
    </div>
  );
}
