import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ChannelDetail from './ChannelDetail';
import Button from 'components/Button';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

Invitation.propTypes = {
  invitationChannelId: PropTypes.number,
  invitePath: PropTypes.number.isRequired,
  channelId: PropTypes.number.isRequired,
  messageId: PropTypes.number.isRequired,
  onAcceptGroupInvitation: PropTypes.func.isRequired,
  sender: PropTypes.object.isRequired
};

export default function Invitation({
  invitationChannelId,
  invitePath,
  channelId: currentChannelId,
  messageId,
  onAcceptGroupInvitation,
  sender
}) {
  const { userId, profileTheme } = useMyState();
  const {
    requestHelpers: { loadChatChannel, parseChannelPath }
  } = useAppContext();
  const {
    state: { channelPathIdHash, channelsObj },
    actions: { onSetChatInvitationDetail, onUpdateChannelPathIdHash }
  } = useChatContext();
  useEffect(() => {
    if (!invitationChannelId) {
      init();
    }
    async function init() {
      const channelId =
        channelPathIdHash[invitePath] || (await parseChannelPath(invitePath));
      if (!channelPathIdHash[invitePath]) {
        onUpdateChannelPathIdHash({
          channelId,
          pathId: invitePath
        });
      }
      const { channel } = await loadChatChannel({
        channelId,
        isForInvitation: true,
        skipUpdateChannelId: true
      });
      onSetChatInvitationDetail({
        channel,
        messageId,
        channelId: currentChannelId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const invitationChannel = useMemo(
    () => channelsObj[invitationChannelId],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invitationChannelId]
  );

  const alreadyJoined = useMemo(() => {
    const memberIds = invitationChannel?.members.map((member) => member.id);
    return memberIds?.includes(userId);
  }, [invitationChannel, userId]);

  const desktopHeight = useMemo(() => {
    if (userId === sender.id) {
      if (!invitationChannel || invitationChannel.members?.length > 3) {
        return '9rem';
      } else {
        return '7rem';
      }
    } else {
      if (!invitationChannel || invitationChannel.members?.length > 3) {
        return '14rem';
      } else {
        return '12rem';
      }
    }
  }, [invitationChannel, sender.id, userId]);

  const mobileHeight = useMemo(() => {
    if (userId === sender.id) {
      if (!invitationChannel || invitationChannel.members?.length > 3) {
        return '7rem';
      } else {
        return '5rem';
      }
    } else {
      if (!invitationChannel || invitationChannel.members?.length > 3) {
        return '12rem';
      } else {
        return '10rem';
      }
    }
  }, [invitationChannel, sender.id, userId]);

  const handleAcceptGroupInvitation = useCallback(() => {
    onAcceptGroupInvitation(invitePath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitePath]);

  return (
    <div
      className={css`
        height: ${desktopHeight};
        @media (max-width: ${mobileMaxWidth}) {
          height: ${mobileHeight};
        }
      `}
    >
      {invitationChannel && (
        <ChannelDetail
          invitePath={invitePath}
          alreadyJoined={alreadyJoined}
          channelName={invitationChannel.channelName}
          members={invitationChannel.members}
        />
      )}
      {userId !== sender.id && (
        <Button
          filled
          color={profileTheme}
          onClick={handleAcceptGroupInvitation}
          disabled={alreadyJoined}
        >
          {alreadyJoined
            ? 'Already Joined'
            : `Accept ${sender.username}'s Invitation`}
        </Button>
      )}
    </div>
  );
}
