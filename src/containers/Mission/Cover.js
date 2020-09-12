import React from 'react';
import { useMyState } from 'helpers/hooks';
import { css } from 'emotion';
import { Color } from 'constants/css';
import ProfilePic from 'components/ProfilePic';

export default function Cover() {
  const { profileTheme, profilePicId, userId, username } = useMyState();

  return (
    <div
      className={css`
        height: 15vh;
        display: flex;
        justify-content: space-between;
        background: ${Color[profileTheme]()};
        padding: 0 5%;
      `}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProfilePic
          className={css`
            width: 9rem;
            height: 9rem;
            font-size: 2rem;
            z-index: 10;
          `}
          userId={userId}
          profilePicId={profilePicId}
        />
        <div
          className={css`
            margin-left: 3rem;
            font-size: 3rem;
            color: #fff;
            font-weight: bold;
          `}
        >
          {username}
        </div>
      </div>
    </div>
  );
}
