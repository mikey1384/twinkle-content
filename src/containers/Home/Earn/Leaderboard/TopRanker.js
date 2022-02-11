import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import { Color, borderRadius } from 'constants/css';
import { css } from '@emotion/css';

TopRanker.propTypes = {
  userId: PropTypes.number,
  profilePicUrl: PropTypes.string,
  style: PropTypes.object,
  username: PropTypes.string,
  rank: PropTypes.number
};

export default function TopRanker({
  userId,
  profilePicUrl,
  style,
  username,
  rank
}) {
  const rankColor = useMemo(() => {
    return rank === 1
      ? Color.gold()
      : rank === 2
      ? Color.lighterGray()
      : Color.orange();
  }, [rank]);

  return (
    <div
      style={{
        display: 'flex',
        width: '30%',
        flexDirection: 'column',
        alignItems: 'center',
        border: `1px solid ${Color.borderGray()}`,
        borderRadius,
        padding: '2rem',
        ...style
      }}
    >
      <ProfilePic
        className={css`
          width: 100%;
          cursor: pointer;
        `}
        userId={userId}
        profilePicUrl={profilePicUrl}
      />
      <p
        style={{
          color: rankColor,
          fontWeight: 'bold',
          marginTop: '1rem'
        }}
      >
        #{rank} {username}
      </p>
    </div>
  );
}
