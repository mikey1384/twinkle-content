import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';
import UserListModal from 'components/Modals/UserListModal';

ChannelDetail.propTypes = {
  inviteFrom: PropTypes.number.isRequired,
  alreadyJoined: PropTypes.bool.isRequired,
  channelName: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  onChannelEnter: PropTypes.func.isRequired
};

export default function ChannelDetail({
  alreadyJoined,
  channelName,
  inviteFrom,
  members,
  onChannelEnter
}) {
  const { profileTheme } = useMyState();
  const [shownMembers, setShownMembers] = useState([]);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [more, setMore] = useState(null);
  useEffect(() => {
    if (members.length > 3) {
      setShownMembers(members.filter((member, index) => index < 3));
      setMore(members.length - 3);
    } else {
      setShownMembers(members);
    }
  }, [members]);

  return (
    <div
      style={{
        width: '100%',
        marginBottom: '1rem',
        padding: '1rem',
        background: Color.highlightGray(),
        color: Color.black(),
        borderRadius
      }}
    >
      <p
        className={css`
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 1;
          font-weight: bold;
          font-size: 2.2rem;
          color: ${Color[profileTheme]()};
          cursor: ${alreadyJoined ? 'pointer' : 'default'};
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.5rem;
          }
        `}
        onClick={() => (alreadyJoined ? onChannelEnter(inviteFrom) : {})}
      >
        Invitation to {channelName}
      </p>
      <div
        style={{ marginTop: '0.5rem' }}
        className={css`
          font-size: 1.5rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1rem;
          }
        `}
      >
        <span style={{ fontWeight: 'bold' }}>members:</span>{' '}
        {shownMembers.map((member, index) => (
          <span key={member.id}>
            {member.username}
            {index === members.length - 1 ? '' : ', '}
          </span>
        ))}
        {more && (
          <p
            className={css`
              cursor: pointer;
              color: ${Color.blue()};
              &:hover {
                text-decoration: underline;
              }
            `}
            onClick={() => setUserListModalShown(true)}
          >
            ...and {more} more
          </p>
        )}
      </div>
      {userListModalShown && (
        <UserListModal
          onHide={() => setUserListModalShown(false)}
          title="Members"
          users={members}
        />
      )}
    </div>
  );
}
