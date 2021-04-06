import React, { memo, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Icon from 'components/Icon';
import Button from 'components/Button';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { useChatContext } from 'contexts';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

MemberListItem.propTypes = {
  onlineMembers: PropTypes.object,
  creatorId: PropTypes.number,
  imLive: PropTypes.bool,
  isClass: PropTypes.bool,
  member: PropTypes.object,
  membersOnCallObj: PropTypes.object,
  peerStreams: PropTypes.object,
  style: PropTypes.object
};

function MemberListItem({
  onlineMembers,
  creatorId,
  imLive,
  isClass,
  membersOnCallObj,
  member,
  peerStreams,
  style
}) {
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const { userId: myId } = useMyState();
  const {
    state: {
      channelOnCall,
      ['user' + member.id]: { isAway, isBusy, username, profilePicUrl } = {}
    },
    actions: { onSetUserData }
  } = useChatContext();

  useEffect(() => {
    if (member.id && member.username) {
      onSetUserData(member);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  const usernameWidth = useMemo(() => (isClass ? '20%' : '42%'), [isClass]);
  const peerIsStreaming = useMemo(
    () =>
      peerStreams?.[membersOnCallObj?.[member.id]] &&
      !channelOnCall.members[membersOnCallObj?.[member.id]]?.streamHidden,
    [peerStreams, membersOnCallObj, member.id, channelOnCall.members]
  );
  const showButtonShown = useMemo(() => {
    return isClass && imLive && creatorId === myId && member.id !== myId;
  }, [creatorId, imLive, isClass, member.id, myId]);

  return username ? (
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
          profilePicUrl={profilePicUrl}
          online={!!onlineMembers[member.id]}
          isAway={isAway}
          isBusy={isBusy}
          statusShown
        />
        <UsernameText
          truncate
          className={css`
            width: auto;
            max-width: ${creatorId === member.id
              ? usernameWidth
              : `CALC(${usernameWidth} + 2rem)`};
          `}
          style={{
            color: Color.darkerGray(),
            marginLeft: '2rem'
          }}
          user={{ id: member.id, username }}
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
        {showButtonShown && (
          <Button
            style={{ fontSize: '1rem', marginLeft: '1rem' }}
            filled
            color={peerIsStreaming ? 'rose' : 'darkBlue'}
          >
            {peerIsStreaming ? 'Hide' : 'Show'}
          </Button>
        )}
      </div>
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Showing over 2 students at a time may slow down the performance or cause errors"
          onConfirm={handleConfirmShowPeer}
        />
      )}
    </div>
  ) : null;

  function handleConfirmShowPeer() {
    socket.emit('show_peer_stream', member.id);
    setConfirmModalShown(false);
  }
}

export default memo(MemberListItem);
