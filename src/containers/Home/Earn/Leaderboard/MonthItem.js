import React from 'react';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import TopRanker from './TopRanker';

export default function MonthItem() {
  const { userId, profilePicUrl, username } = useMyState();
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
        <TopRanker
          username={username}
          profilePicUrl={profilePicUrl}
          userId={userId}
          rank={1}
        />
        <TopRanker
          style={{ marginLeft: '1rem' }}
          username={username}
          profilePicUrl={profilePicUrl}
          userId={userId}
          rank={2}
        />
        <TopRanker
          style={{ marginLeft: '1rem' }}
          username={username}
          profilePicUrl={profilePicUrl}
          userId={userId}
          rank={3}
        />
      </div>
    </div>
  );
}
