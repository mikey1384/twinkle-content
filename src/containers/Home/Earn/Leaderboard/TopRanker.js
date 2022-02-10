import React from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import { Color, borderRadius } from 'constants/css';

TopRanker.propTypes = {
  userId: PropTypes.number,
  profilePicUrl: PropTypes.string,
  username: PropTypes.string
};

export default function TopRanker({ userId, profilePicUrl, username }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `1px solid ${Color.borderGray()}`,
        borderRadius,
        padding: '2rem'
      }}
    >
      <ProfilePic
        style={{
          width: '15rem',
          height: '15rem',
          cursor: 'pointer'
        }}
        userId={userId}
        profilePicUrl={profilePicUrl}
      />
      <p
        style={{
          color: Color.gold(),
          fontWeight: 'bold',
          marginTop: '1rem'
        }}
      >
        #1 {username}
      </p>
    </div>
  );
}
