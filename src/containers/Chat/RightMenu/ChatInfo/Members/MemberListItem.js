import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Icon from 'components/Icon';
import { useChatContext } from 'contexts';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';

MemberListItem.propTypes = {
  onlineMembers: PropTypes.object,
  creatorId: PropTypes.number,
  isClass: PropTypes.bool,
  member: PropTypes.object,
  style: PropTypes.object
};

function MemberListItem({ onlineMembers, creatorId, isClass, member, style }) {
  const {
    state: {
      chatStatus: {
        [member.id]: { isAway, isBusy, username, profilePicUrl } = {}
      }
    }
  } = useChatContext();

  const usernameWidth = useMemo(() => (isClass ? '20%' : '42%'), [isClass]);
  return username || member.username ? (
    <div
      style={{
        display: 'flex',
        width: '100%',
        padding: '1rem',
        ...style
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ProfilePic
          className={css`
            height: 4rem;
            width: 4rem;
            @media (max-width: ${mobileMaxWidth}) {
              height: 3rem;
              width: 3rem;
            }
          `}
          userId={member.id}
          profilePicUrl={profilePicUrl || member.profilePicUrl}
          online={!!onlineMembers[member.id]}
          isAway={isAway}
          isBusy={isBusy}
          statusShown
        />
        <UsernameText
          style={{
            color: Color.darkerGray(),
            marginLeft: '2rem',
            maxWidth:
              creatorId === member.id
                ? usernameWidth
                : `CALC(${usernameWidth} + 2rem)`
          }}
          className={css`
            font-size: 1.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.3rem;
            }
          `}
          user={{ id: member.id, username: username || member.username }}
        />
        {creatorId === member.id ? (
          <div
            style={{
              marginLeft: '1rem'
            }}
          >
            <Icon icon="crown" style={{ color: Color.brownOrange() }} />
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
}

export default memo(MemberListItem);
