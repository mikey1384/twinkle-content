import React from 'react';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import ProfilePic from 'components/ProfilePic';

export default function Cover() {
  const { profileTheme, profilePicUrl, userId, username } = useMyState();

  return (
    <div
      className={css`
        height: 15vh;
        display: flex;
        justify-content: space-between;
        background: ${Color[profileTheme]()};
        padding: 0 5%;
        @media (max-width: ${mobileMaxWidth}) {
          height: 8rem;
          padding-left: 1rem;
          padding-right: 1rem;
        }
      `}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProfilePic
          className={css`
            width: 9rem;
            height: 9rem;
            font-size: 2rem;
            z-index: 10;
            @media (max-width: ${mobileMaxWidth}) {
              width: 5rem;
              height: 5rem;
            }
          `}
          userId={userId}
          profilePicUrl={profilePicUrl}
        />
        <div
          className={css`
            margin-left: 3rem;
            font-size: 3rem;
            color: #fff;
            font-weight: bold;
            @media (max-width: ${mobileMaxWidth}) {
              margin-left: 1.5rem;
              font-size: 1.7rem;
            }
          `}
        >
          {username}
        </div>
      </div>
    </div>
  );
}
