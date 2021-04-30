import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Members from './Members';
import ChannelDetails from './ChannelDetails';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';
import { socket } from 'constants/io';
import { GENERAL_CHAT_ID } from 'constants/defaultValues';
import CallButton from './CallButton';

ChatInfo.propTypes = {
  channelName: PropTypes.string,
  channelOnCall: PropTypes.object,
  currentChannel: PropTypes.object.isRequired,
  currentChannelOnlineMembers: PropTypes.object.isRequired,
  selectedChannelId: PropTypes.number
};

function ChatInfo({
  selectedChannelId,
  channelOnCall,
  currentChannel,
  currentChannel: { theme },
  currentChannelOnlineMembers,
  channelName
}) {
  const { userId: myId, username, profilePicUrl } = useMyState();
  const {
    actions: { onSetCall, onHangUp, onSubmitMessage }
  } = useChatContext();

  const callOngoing = useMemo(
    () =>
      selectedChannelId === channelOnCall.id && !!channelOnCall.members[myId],
    [channelOnCall.id, channelOnCall.members, myId, selectedChannelId]
  );

  const calling = useMemo(() => {
    return !channelOnCall.callReceived && channelOnCall.imCalling;
  }, [channelOnCall.callReceived, channelOnCall.imCalling]);

  const voiceChatButtonShown = useMemo(() => {
    if (currentChannel.twoPeople) {
      if (currentChannel.members?.length !== 2) return false;
      return !!currentChannel.id;
    }
    return (
      currentChannel.isClass &&
      (callOngoing || currentChannel.creatorId === myId)
    );
  }, [callOngoing, currentChannel, myId]);

  const displayedChannelMembers = useMemo(() => {
    const totalChannelMembers = currentChannel?.members || [];
    const me = { id: myId, username, profilePicUrl };
    let currentChannelOnlineMembersOtherThanMe = Object.entries(
      currentChannelOnlineMembers
    )
      .map(([, member]) => member)
      .filter((member) => !!member.id && member.id !== myId);
    if (selectedChannelId !== GENERAL_CHAT_ID) {
      const totalChannelMemberIds = totalChannelMembers.map(
        (member) => member.id
      );
      currentChannelOnlineMembersOtherThanMe = currentChannelOnlineMembersOtherThanMe.filter(
        (member) => totalChannelMemberIds.includes(member.id)
      );
    }
    const totalValidChannelMembers = totalChannelMembers.filter(
      (member) => !!member.id
    );
    const currentlyOnlineIds = Object.keys(
      currentChannelOnlineMembers
    ).map((memberId) => Number(memberId));
    if (totalValidChannelMembers.length > 0) {
      const offlineChannelMembers = totalValidChannelMembers.filter(
        (member) =>
          !currentlyOnlineIds.includes(member.id) && member.id !== myId
      );
      return [
        me,
        ...currentChannelOnlineMembersOtherThanMe,
        ...offlineChannelMembers
      ];
    }
    return [me, ...currentChannelOnlineMembersOtherThanMe];
  }, [
    currentChannel,
    myId,
    username,
    profilePicUrl,
    currentChannelOnlineMembers,
    selectedChannelId
  ]);

  return (
    <>
      <div
        className={css`
          width: 100%;
          display: flex;
          padding-bottom: 1rem;
          justify-content: center;
          color: ${Color.darkerGray()};
        `}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            width: '100%'
          }}
          className="unselectable"
        >
          {voiceChatButtonShown && (
            <CallButton callOngoing={callOngoing} onCall={handleCall} />
          )}
          <ChannelDetails
            style={{ marginTop: '1rem' }}
            channelId={currentChannel.id}
            channelName={channelName}
          />
          {displayedChannelMembers.length > 2 && (
            <div
              className={css`
                color: ${Color[theme || 'green']()};
                font-size: 1.5rem;
                font-weight: bold;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
            >
              {Object.keys(currentChannelOnlineMembers).length}
              {currentChannel.id !== GENERAL_CHAT_ID &&
                '/' + displayedChannelMembers.length}{' '}
              online
            </div>
          )}
        </div>
      </div>
      <Members
        isClass={!!currentChannel.isClass}
        channelId={selectedChannelId}
        creatorId={currentChannel.creatorId}
        members={displayedChannelMembers}
        onlineMembers={currentChannelOnlineMembers}
      />
    </>
  );

  function handleCall() {
    if (!channelOnCall.id) {
      onSubmitMessage({
        message: {
          content: 'made a call',
          channelId: selectedChannelId,
          profilePicUrl,
          userId: myId,
          username,
          isNotification: true,
          isCallNotification: true
        }
      });
      onSetCall({
        imCalling: true,
        channelId: selectedChannelId,
        isClass: currentChannel.isClass
      });
    } else {
      if (calling) {
        onSetCall({});
      } else {
        onHangUp({ memberId: myId, iHungUp: true });
      }
      socket.emit('hang_up_call', channelOnCall.id, () => {
        if (selectedChannelId !== channelOnCall.id) {
          onSubmitMessage({
            message: {
              content: 'made a call',
              channelId: selectedChannelId,
              profilePicUrl,
              userId: myId,
              username,
              isNotification: true,
              isCallNotification: true
            }
          });
          onSetCall({
            imCalling: true,
            channelId: selectedChannelId,
            isClass: currentChannel.isClass
          });
        }
      });
    }
  }
}

export default memo(ChatInfo);
