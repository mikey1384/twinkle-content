import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ChannelDetail from './ChannelDetail';
import Button from 'components/Button';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext, useContentContext } from 'contexts';

Invitation.propTypes = {
  invitePath: PropTypes.number.isRequired,
  messageId: PropTypes.number.isRequired,
  onAcceptGroupInvitation: PropTypes.func.isRequired,
  sender: PropTypes.object.isRequired
};

export default function Invitation({
  invitePath,
  messageId,
  onAcceptGroupInvitation,
  sender
}) {
  const { userId, profileTheme } = useMyState();
  const { invitationDetail } = useContentState({
    contentType: 'chat',
    contentId: messageId
  });
  const {
    requestHelpers: { loadChatChannel, parseChannelPath }
  } = useAppContext();
  const {
    actions: { onSetChatInvitationDetail }
  } = useContentContext();
  const {
    state: { channelPathIdHash },
    actions: { onUpdateChannelPathIdHash }
  } = useChatContext();
  useEffect(() => {
    if (!invitationDetail) {
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
        skipUpdateChannelId: true
      });
      onSetChatInvitationDetail({ messageId, detail: channel });
    }
    return function cleanUp() {
      onSetChatInvitationDetail({ messageId, detail: null });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alreadyJoined = useMemo(() => {
    const memberIds = invitationDetail?.members.map((member) => member.id);
    return memberIds?.includes(userId);
  }, [invitationDetail, userId]);

  const desktopHeight = useMemo(() => {
    if (userId === sender.id) {
      if (!invitationDetail || invitationDetail.members?.length > 3) {
        return '9rem';
      } else {
        return '7rem';
      }
    } else {
      if (!invitationDetail || invitationDetail.members?.length > 3) {
        return '14rem';
      } else {
        return '12rem';
      }
    }
  }, [invitationDetail, sender.id, userId]);

  const mobileHeight = useMemo(() => {
    if (userId === sender.id) {
      if (!invitationDetail || invitationDetail.members?.length > 3) {
        return '7rem';
      } else {
        return '5rem';
      }
    } else {
      if (!invitationDetail || invitationDetail.members?.length > 3) {
        return '12rem';
      } else {
        return '10rem';
      }
    }
  }, [invitationDetail, sender.id, userId]);

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
      {invitationDetail && (
        <ChannelDetail
          invitePath={invitePath}
          alreadyJoined={alreadyJoined}
          channelName={invitationDetail.channelName}
          members={invitationDetail.members}
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
