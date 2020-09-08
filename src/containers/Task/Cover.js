import React from 'react';
import { useMyState } from 'helpers/hooks';
import { css } from 'emotion';
import { Color } from 'constants/css';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';

export default function Cover() {
  const {
    profileTheme,
    profilePicId,
    userId,
    username,
    canEdit
  } = useMyState();

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
      {canEdit && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: '1rem'
          }}
        >
          <Button skeuomorphic>Add Tutorial</Button>
        </div>
      )}
    </div>
  );
}
