import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import CreateNewChatModal from './Modals/CreateNewChat';
import UserListModal from 'components/Modals/UserListModal';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import Body from './Body';
import Loading from 'components/Loading';
import PleaseLogIn from './PleaseLogIn';
import LocalContext from './Context';
import { phoneMaxWidth } from 'constants/css';
import { socket } from 'constants/io';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';
import { useLocation, useHistory } from 'react-router-dom';
import {
  useAppContext,
  useNotiContext,
  useViewContext,
  useChatContext
} from 'contexts';
import { GENERAL_CHAT_ID } from 'constants/defaultValues';
import ErrorBoundary from 'components/ErrorBoundary';

Chat.propTypes = {
  onFileUpload: PropTypes.func
};

function Chat({ onFileUpload }) {
  const { pathname } = useLocation();
  const history = useHistory();
  const {
    requestHelpers: {
      createNewChat,
      loadChatChannel,
      parseChannelPath,
      updateChatLastRead,
      updateLastChannelId
    }
  } = useAppContext();
  const { userId } = useMyState();
  const {
    state: {
      loaded,
      selectedChannelId,
      channelsObj,
      channelPathIdHash,
      channelOnCall,
      currentChannelName,
      chatStatus
    },
    actions: {
      onClearNumUnreads,
      onCreateNewChannel,
      onEnterChannelWithId,
      onEnterEmptyChat,
      onNotifyThatMemberLeftChannel,
      onReceiveMessage,
      onReceiveMessageOnDifferentChannel,
      onSetChessModalShown,
      onSetCurrentChannelName,
      onTrimMessages,
      onUpdateChannelPathIdHash,
      onUpdateChessMoveViewTimeStamp,
      onUpdateSelectedChannelId
    }
  } = useChatContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  const [creatingChat, setCreatingChat] = useState(false);
  const [createNewChatModalShown, setCreateNewChatModalShown] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [partner, setPartner] = useState(null);
  const mounted = useRef(true);
  const currentChannel = useMemo(
    () => channelsObj[selectedChannelId] || {},
    [channelsObj, selectedChannelId]
  );

  useEffect(() => {
    const currentChannelPath = pathname.split('chat/')[1];
    handleChannelEnter(currentChannelPath);

    async function handleChannelEnter(channelPath) {
      const channelId =
        channelPathIdHash[channelPath] || (await parseChannelPath(channelPath));
      if (!channelPathIdHash[channelPath] && mounted.current) {
        onUpdateChannelPathIdHash({ channelId, channelPath });
      }
      if (channelId === 0 && mounted.current) {
        return onEnterEmptyChat();
      }
      if (mounted.current) {
        onUpdateSelectedChannelId(channelId);
      }
      if (channelsObj[channelId]?.loaded) {
        return updateLastChannelId(channelId);
      }
      const data = await loadChatChannel({ channelId });
      if (mounted.current) {
        onEnterChannelWithId({ data });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const currentChannelPath = pathname.split('chat/')[1];
    if (!currentChannelPath && currentChannel.pathNumber) {
      history.replace(`/chat/${currentChannel.pathNumber}`);
    }
  }, [currentChannel.pathNumber, history, pathname]);

  useEffect(() => {
    if (userId && loaded && selectedChannelId) {
      updateChatLastRead(selectedChannelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, userId, selectedChannelId]);

  useEffect(() => {
    if (pageVisible) {
      onClearNumUnreads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVisible, socketConnected]);

  useEffect(() => {
    const otherMember = currentChannel.twoPeople
      ? currentChannel?.members?.filter(
          (member) => Number(member.id) !== userId
        )?.[0]
      : null;
    setPartner(otherMember);
    onSetCurrentChannelName(
      otherMember?.username || channelsObj[currentChannel?.id]?.channelName
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelsObj, currentChannel, userId]);

  useEffect(() => {
    socket.on('chess_move_made', onNotifiedMoveMade);
    socket.on('chess_move_viewed', onNotifyMoveViewed);
    socket.on('subject_changed', handleTopicChange);
    socket.on('member_left', handleMemberLeft);

    function handleMemberLeft({ channelId, leaver }) {
      const forCurrentChannel = channelId === selectedChannelId;
      if (forCurrentChannel) {
        const { userId, username, profilePicUrl } = leaver;
        onNotifyThatMemberLeftChannel({
          channelId,
          userId,
          username,
          profilePicUrl
        });
      }
    }

    function onNotifiedMoveMade({ channelId }) {
      if (channelId === selectedChannelId) {
        onSetChessModalShown(false);
      }
    }

    function onNotifyMoveViewed(channelId) {
      onUpdateChessMoveViewTimeStamp(channelId);
    }

    return function cleanUp() {
      socket.removeListener('chess_move_made', onNotifiedMoveMade);
      socket.removeListener('chess_move_viewed', onNotifyMoveViewed);
      socket.removeListener('subject_changed', handleTopicChange);
      socket.removeListener('member_left', handleMemberLeft);
    };
  });

  useEffect(() => {
    socket.emit('change_away_status', pageVisible);
    mounted.current = true;
    return function cleanUp() {
      onClearNumUnreads();
      if (selectedChannelId) {
        onTrimMessages(selectedChannelId);
      }
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  const currentChannelOnlineMembers = useMemo(() => {
    if (currentChannel.id === GENERAL_CHAT_ID) {
      const result = {};
      for (let [, member] of Object.entries(chatStatus)) {
        if (member?.isOnline) {
          result[member.id] = member;
        }
      }
      return result;
    }
    const onlineMembersArray = (currentChannel?.members || []).filter(
      (member) => !!chatStatus[member.id]?.isOnline
    );
    const result = {};
    for (let member of onlineMembersArray) {
      result[member.id] = member;
    }
    return result;
  }, [chatStatus, currentChannel.id, currentChannel?.members]);

  const handleCreateNewChannel = useCallback(
    async ({ userId, channelName, isClosed }) => {
      setCreatingChat(true);
      const { message, members } = await createNewChat({
        userId,
        channelName,
        isClosed
      });
      onCreateNewChannel({ message, isClosed, members });
      socket.emit('join_chat_group', message.channelId);
      setCreateNewChatModalShown(false);
      setCreatingChat(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleTopicChange = useCallback(
    ({ message, channelId, channelName }) => {
      let messageIsForCurrentChannel = message.channelId === selectedChannelId;
      let senderIsUser = message.userId === userId;
      if (senderIsUser) return;
      if (messageIsForCurrentChannel) {
        onReceiveMessage({ message, pageVisible });
      }
      if (!messageIsForCurrentChannel) {
        onReceiveMessageOnDifferentChannel({
          pageVisible,
          channel: {
            id: channelId,
            channelName,
            isHidden: false,
            numUnreads: 1
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageVisible, selectedChannelId, userId]
  );

  return (
    <LocalContext.Provider
      value={{
        currentChannelOnlineMembers,
        onFileUpload
      }}
    >
      <ErrorBoundary>
        {userId ? (
          loaded ? (
            <div
              className={css`
                width: 100%;
                height: 100%;
                display: flex;
                font-size: 1.6rem;
                position: relative;
                @media (max-width: ${phoneMaxWidth}) {
                  width: 152vw;
                  height: 100%;
                }
              `}
            >
              {createNewChatModalShown && (
                <CreateNewChatModal
                  creatingChat={creatingChat}
                  onHide={() => setCreateNewChatModalShown(false)}
                  onDone={handleCreateNewChannel}
                />
              )}
              {userListModalShown && (
                <UserListModal
                  onHide={() => setUserListModalShown(false)}
                  users={returnUsers(
                    currentChannel,
                    currentChannelOnlineMembers
                  )}
                  descriptionShown={(user) =>
                    !!currentChannelOnlineMembers[user.id]
                  }
                  description="(online)"
                  title="Online Status"
                />
              )}
              <LeftMenu
                onNewButtonClick={() => setCreateNewChatModalShown(true)}
                showUserListModal={() => setUserListModalShown(true)}
              />
              <Body
                channelName={currentChannelName}
                chessOpponent={partner}
                currentChannel={currentChannel}
              />
              <RightMenu
                channelOnCall={channelOnCall}
                channelName={currentChannelName}
                currentChannel={currentChannel}
                currentChannelOnlineMembers={currentChannelOnlineMembers}
                selectedChannelId={selectedChannelId}
              />
            </div>
          ) : (
            <Loading text="Loading Twinkle Chat" />
          )
        ) : (
          <PleaseLogIn />
        )}
      </ErrorBoundary>
    </LocalContext.Provider>
  );

  function returnUsers({ members: allMembers }, currentChannelOnlineMembers) {
    return allMembers.length > 0
      ? allMembers
      : Object.entries(currentChannelOnlineMembers).map(([, member]) => member);
  }
}

export default memo(Chat);
