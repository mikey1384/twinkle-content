import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import ConfirmModal from 'components/Modals/ConfirmModal';
import MessageInput from './MessageInput';
import DropdownButton from 'components/Buttons/DropdownButton';
import Loading from 'components/Loading';
import Message from '../../Message';
import ChannelHeader from './ChannelHeader';
import FullTextReveal from 'components/Texts/FullTextReveal';
import SubjectMsgsModal from '../../Modals/SubjectMsgsModal';
import InviteUsersModal from '../../Modals/InviteUsers';
import ChessModal from '../../Modals/ChessModal';
import SelectVideoModal from '../../Modals/SelectVideoModal';
import SelectNewOwnerModal from '../../Modals/SelectNewOwnerModal';
import SettingsModal from '../../Modals/SettingsModal';
import CallScreen from './CallScreen';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import { v1 as uuidv1 } from 'uuid';
import { GENERAL_CHAT_ID, rewardReasons } from 'constants/defaultValues';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import { socket } from 'constants/io';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext, useNotiContext } from 'contexts';
import { isMobile } from 'helpers';
import { useHistory } from 'react-router-dom';

MessagesContainer.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object.isRequired,
  loading: PropTypes.bool
};

const CALL_SCREEN_HEIGHT = '30%';
const deviceIsMobile = isMobile(navigator);

function MessagesContainer({
  channelName,
  chessOpponent,
  currentChannel,
  loading: channelLoading
}) {
  const history = useHistory();
  const {
    requestHelpers: {
      acceptInvitation,
      changeChannelOwner,
      deleteChatMessage,
      editChannelSettings,
      hideChat,
      loadGeneralChatPathId,
      leaveChannel,
      loadChatChannel,
      loadMoreChatMessages,
      parseChannelPath,
      putFavoriteChannel,
      sendInvitationMessage,
      startNewDMChannel,
      updateUserXP
    }
  } = useAppContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  const {
    state: {
      channelOnCall,
      channelPathIdHash,
      chessModalShown,
      creatingNewDMChannel,
      allFavoriteChannelIds,
      recepientId,
      reconnecting,
      selectedChannelId,
      subjectObj
    },
    actions: {
      onDeleteMessage,
      onEditChannelSettings,
      onEnterChannelWithId,
      onHideChat,
      onLeaveChannel,
      onLoadMoreMessages,
      onReceiveMessageOnDifferentChannel,
      onSendFirstDirectMessage,
      onSetChessModalShown,
      onSetCreatingNewDMChannel,
      onSetFavoriteChannel,
      onSetReplyTarget,
      onSubmitMessage,
      onUpdateChannelPathIdHash
    }
  } = useChatContext();
  const {
    isRespondingToSubject = false,
    messageIds = [],
    messagesObj = {},
    messagesLoadMoreButton = false,
    loaded
  } = currentChannel;
  const { banned, profilePicUrl, userId, username } = useMyState();
  const [chessCountdownObj, setChessCountdownObj] = useState({});
  const [textAreaHeight, setTextAreaHeight] = useState(0);
  const [inviteUsersModalShown, setInviteUsersModalShown] = useState(false);
  const [loadMoreButtonLock, setLoadMoreButtonLock] = useState(false);
  const [newUnseenMessage, setNewUnseenMessage] = useState(false);
  const [selectVideoModalShown, setSelectVideoModalShown] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    shown: false,
    fileName: '',
    filePath: '',
    messageId: null
  });
  const [subjectMsgsModal, setSubjectMsgsModal] = useState({
    shown: false,
    subjectId: null,
    content: ''
  });
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [leaveConfirmModalShown, setLeaveConfirmModalShown] = useState(false);
  const [selectNewOwnerModalShown, setSelectNewOwnerModalShown] =
    useState(false);
  const [hideModalShown, setHideModalShown] = useState(false);
  const [addToFavoritesShown, setAddToFavoritesShown] = useState(false);
  const [bottomPaddingHeight, setBottomPaddingHeight] = useState(0);
  const MessagesRef = useRef(null);
  const mounted = useRef(true);
  const ChatInputRef = useRef(null);
  const favoritingRef = useRef(false);
  const timerRef = useRef(null);
  const prevChannelId = useRef(null);
  const prevTopMessageId = useRef(null);
  const prevScrollPosition = useRef(null);
  const menuLabel = deviceIsMobile ? '' : 'Menu';
  const messages = useMemo(
    () => messageIds.map((messageId) => messagesObj[messageId] || {}),
    [messageIds, messagesObj]
  );

  const favorited = useMemo(() => {
    return allFavoriteChannelIds[selectedChannelId];
  }, [allFavoriteChannelIds, selectedChannelId]);

  const selectedChannelIsOnCall = useMemo(
    () => selectedChannelId === channelOnCall.id,
    [channelOnCall.id, selectedChannelId]
  );

  const subjectId = useMemo(
    () => subjectObj[selectedChannelId]?.id,
    [selectedChannelId, subjectObj]
  );

  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (selectedChannelId === channelOnCall.id) {
      handleScrollToBottom();
    }
  }, [channelOnCall, selectedChannelId]);

  const containerHeight = useMemo(() => {
    return `CALC(100% - 1rem - 2px - ${
      socketConnected && textAreaHeight
        ? `${textAreaHeight}px - 1rem`
        : '5.5rem'
    }${
      socketConnected && isRespondingToSubject
        ? ' - 8rem - 2px'
        : currentChannel.replyTarget
        ? ' - 12rem - 2px'
        : ''
    }
    ${selectedChannelIsOnCall ? ` - ${CALL_SCREEN_HEIGHT}` : ''})`;
  }, [
    isRespondingToSubject,
    currentChannel.replyTarget,
    selectedChannelIsOnCall,
    socketConnected,
    textAreaHeight
  ]);

  const loading = useMemo(
    () => !loaded || channelLoading || creatingNewDMChannel || reconnecting,
    [loaded, channelLoading, creatingNewDMChannel, reconnecting]
  );

  const chessCountdownNumber = useMemo(
    () => chessCountdownObj[selectedChannelId],
    [chessCountdownObj, selectedChannelId]
  );

  const menuProps = useMemo(() => {
    if (currentChannel.twoPeople) {
      return [
        {
          label: (
            <>
              <Icon icon="minus" />
              <span style={{ marginLeft: '1rem' }}>Hide</span>
            </>
          ),
          onClick: () => setHideModalShown(true)
        }
      ];
    }
    const result = [];
    if (!currentChannel.isClosed || currentChannel.creatorId === userId) {
      result.push({
        label: (
          <>
            <Icon icon="users" />
            <span style={{ marginLeft: '1rem' }}>Invite People</span>
          </>
        ),
        onClick: () => setInviteUsersModalShown(true)
      });
    }
    result.push(
      {
        label:
          currentChannel.creatorId === userId ? (
            <>
              <Icon icon="sliders-h" />
              <span style={{ marginLeft: '1rem' }}>Settings</span>
            </>
          ) : (
            <>
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '1rem' }}>Edit Group Name</span>
            </>
          ),
        onClick: () => setSettingsModalShown(true)
      },
      {
        separator: true
      },
      {
        label: (
          <>
            <Icon icon="sign-out-alt" />
            <span style={{ marginLeft: '1rem' }}>Leave</span>
          </>
        ),
        onClick: () => setLeaveConfirmModalShown(true)
      }
    );
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentChannel.twoPeople,
    currentChannel.isClosed,
    currentChannel.creatorId,
    userId,
    selectedChannelId
  ]);

  const channelHeaderShown = useMemo(() => {
    return (
      selectedChannelId === GENERAL_CHAT_ID || !!currentChannel.canChangeSubject
    );
  }, [currentChannel.canChangeSubject, selectedChannelId]);

  useEffect(() => {
    handleScrollToBottom();
    prevChannelId.current = selectedChannelId;
    prevTopMessageId.current = null;
  }, [selectedChannelId]);

  useEffect(() => {
    const topMessageId = messageIds[messageIds.length - 1];
    if (
      prevChannelId.current === selectedChannelId &&
      prevTopMessageId.current &&
      topMessageId !== prevTopMessageId.current
    ) {
      MessagesRef.current.scrollTop = prevScrollPosition.current;
    }
    if (messageIds.length > 1) {
      // prevent scroll event from being triggered by a preview message
      prevTopMessageId.current = topMessageId;
    }
  }, [messageIds, selectedChannelId]);

  useEffect(() => {
    socket.on('chess_countdown_number_received', onReceiveCountdownNumber);
    socket.on('new_message_received', handleReceiveMessage);

    function onReceiveCountdownNumber({ channelId, number }) {
      if (channelId === selectedChannelId) {
        if (number === 0) {
          onSetChessModalShown(false);
        }
        setChessCountdownObj((chessCountdownObj) => ({
          ...chessCountdownObj,
          [channelId]: number
        }));
      }
    }
    function handleReceiveMessage({ message }) {
      if (message.isChessMsg) {
        setChessCountdownObj((chessCountdownObj) => ({
          ...chessCountdownObj,
          [message.channelId]: undefined
        }));
      }
    }

    return function cleanUp() {
      socket.removeListener(
        'chess_countdown_number_received',
        onReceiveCountdownNumber
      );
      socket.removeListener('new_message_received', handleReceiveMessage);
    };
  });

  useEffect(() => {
    const MessagesContainer = MessagesRef.current;
    addEvent(MessagesContainer, 'scroll', handleScroll);

    return function cleanUp() {
      removeEvent(MessagesContainer, 'scroll', handleScroll);
    };

    function handleScroll() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const scrollThreshold =
          MessagesRef.current.scrollHeight - MessagesRef.current.offsetHeight;
        const scrollTop = MessagesRef.current.scrollTop;
        const distanceFromTop = scrollThreshold + scrollTop;
        if (mounted.current && distanceFromTop < 3) {
          handleLoadMore();
        }
      }, 200);
    }
  });

  useEffect(() => {
    favoritingRef.current = false;
    setLoadMoreButtonLock(false);
  }, [selectedChannelId]);

  const handleChessModalShown = useCallback(() => {
    if (banned?.chess) {
      return;
    }
    const channelId = currentChannel?.id;
    if (chessCountdownObj[channelId] !== 0) {
      onSetReplyTarget({ channelId, target: null });
      onSetChessModalShown(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banned?.chess, chessCountdownObj, currentChannel?.id]);

  const handleHideChat = useCallback(async () => {
    await hideChat(selectedChannelId);
    onHideChat(selectedChannelId);
    const data = await loadChatChannel({
      channelId: GENERAL_CHAT_ID
    });
    onEnterChannelWithId({ data });
    setHideModalShown(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  const handleChessSpoilerClick = useCallback(
    (senderId) => {
      socket.emit('viewed_chess_move', selectedChannelId);
      socket.emit('start_chess_timer', {
        currentChannel,
        targetUserId: userId,
        winnerId: senderId,
        isResign: false
      });
      onSetChessModalShown(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentChannel, selectedChannelId, userId]
  );

  const handleConfirmChessMove = useCallback(
    async ({ state, isCheckmate, isStalemate }) => {
      const gameWinnerId = isCheckmate ? userId : isStalemate ? 0 : undefined;
      const params = {
        userId,
        chessState: state,
        isChessMsg: 1,
        gameWinnerId
      };
      const content = 'Made a chess move';
      try {
        if (selectedChannelId) {
          const messageId = uuidv1();
          onSubmitMessage({
            messageId,
            message: {
              ...params,
              profilePicUrl,
              username,
              content,
              channelId: selectedChannelId
            }
          });
          onSetReplyTarget({ channelId: selectedChannelId, target: null });
          socket.emit('user_made_a_move', {
            userId,
            channelId: selectedChannelId
          });
        } else {
          const { alreadyExists, channel, message, pathId } =
            await startNewDMChannel({
              ...params,
              content,
              recepientId
            });
          if (alreadyExists) {
            return window.location.reload();
          }
          socket.emit('join_chat_group', message.channelId);
          socket.emit('send_bi_chat_invitation', {
            userId: recepientId,
            members: currentChannel.members,
            pathId,
            message
          });
          onUpdateChannelPathIdHash({ channelId: channel.id, pathId });
          onSendFirstDirectMessage({ channel, message });
          history.replace(`/chat/${pathId}`);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profilePicUrl, recepientId, selectedChannelId, userId, username]
  );

  const handleDelete = useCallback(async () => {
    const { fileName, filePath, messageId } = deleteModal;
    await deleteChatMessage({ fileName, filePath, messageId });
    onDeleteMessage({ channelId: selectedChannelId, messageId });
    setDeleteModal({
      shown: false,
      fileName: '',
      filePath: '',
      messageId: null
    });
    socket.emit('delete_chat_message', {
      channelId: selectedChannelId,
      messageId
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteModal, selectedChannelId]);

  const handleEditSettings = useCallback(
    async ({
      editedChannelName,
      editedIsClosed,
      editedCanChangeSubject,
      editedTheme
    }) => {
      await editChannelSettings({
        channelName: editedChannelName,
        isClosed: editedIsClosed,
        channelId: selectedChannelId,
        canChangeSubject: editedCanChangeSubject,
        theme: editedTheme
      });
      onEditChannelSettings({
        channelName: editedChannelName,
        isClosed: editedIsClosed,
        channelId: selectedChannelId,
        canChangeSubject: editedCanChangeSubject,
        theme: editedTheme
      });
      if (userId === currentChannel.creatorId) {
        socket.emit('new_channel_settings', {
          channelName: editedChannelName,
          isClosed: editedIsClosed,
          channelId: selectedChannelId,
          canChangeSubject: editedCanChangeSubject,
          theme: editedTheme
        });
      }
      setSettingsModalShown(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentChannel?.creatorId, selectedChannelId, userId]
  );

  const handleInviteUsersDone = useCallback(
    async ({ users, message, isClass }) => {
      if (isClass) {
        const channelData = {
          id: selectedChannelId,
          channelName,
          pathId: currentChannel.pathId
        };
        socket.emit('new_chat_message', {
          message: {
            ...message,
            channelId: message.channelId
          },
          channel: channelData,
          newMembers: users
        });
        socket.emit(
          'send_group_chat_invitation',
          users.map((user) => user.id),
          {
            message: { ...message, messageId: message.id },
            isClass,
            pathId: currentChannel.pathId
          }
        );
      } else {
        const recepientIds = users.map((user) => user.id);
        const { channels, messages } = await sendInvitationMessage({
          recepients: recepientIds,
          origin: currentChannel.id
        });
        for (let i = 0; i < channels.length; i++) {
          onReceiveMessageOnDifferentChannel({
            message: messages[i],
            channel: channels[i].channel,
            pageVisible: true,
            usingChat: true,
            isMyMessage: true
          });
        }
      }
      setInviteUsersModalShown(false);
      if (!isClass) {
        const messageId = uuidv1();
        onSubmitMessage({
          messageId,
          message: {
            channelId: selectedChannelId,
            userId,
            username,
            id: uuidv1(),
            profilePicUrl,
            content: `sent ${
              users.length === 1 ? 'an ' : ''
            }invitation message${users.length > 1 ? 's' : ''} to ${
              users.length > 1 ? `${users.length} users` : users[0].username
            }`,
            isNotification: true
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      channelName,
      currentChannel,
      profilePicUrl,
      selectedChannelId,
      userId,
      username
    ]
  );

  const handleLeaveChannel = useCallback(async () => {
    if (!leaving) {
      try {
        setLeaving(true);
        await leaveChannel(selectedChannelId);
        onLeaveChannel(selectedChannelId);
        socket.emit('leave_chat_channel', {
          channelId: selectedChannelId,
          userId,
          username,
          profilePicUrl
        });
        const pathId = await loadGeneralChatPathId();
        history.push(`/chat/${pathId}`);
        setLeaveConfirmModalShown(false);
        setLeaving(false);
      } catch (error) {
        console.error(error);
        setLeaving(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving, profilePicUrl, selectedChannelId, userId, username]);

  const handleLeaveConfirm = useCallback(() => {
    if (currentChannel.creatorId === userId) {
      setLeaveConfirmModalShown(false);
      if (currentChannel.members.length === 1) {
        handleLeaveChannel();
      } else {
        setSelectNewOwnerModalShown(true);
      }
    } else {
      handleLeaveChannel();
    }
  }, [
    currentChannel?.creatorId,
    currentChannel?.members?.length,
    handleLeaveChannel,
    userId
  ]);

  const handleLoadMore = useCallback(async () => {
    if (messagesLoadMoreButton) {
      const messageId = messages[messages.length - 1].id;
      if (!loadMoreButtonLock) {
        setLoadMoreButtonLock(true);
        prevScrollPosition.current =
          (MessagesRef.current.scrollHeight -
            MessagesRef.current.offsetHeight) *
          -1;
        try {
          const { messageIds, messagesObj, loadedChannelId } =
            await loadMoreChatMessages({
              userId,
              messageId,
              channelId: selectedChannelId
            });
          onLoadMoreMessages({ messageIds, messagesObj, loadedChannelId });
          setLoadMoreButtonLock(false);
        } catch (error) {
          console.error(error);
          setLoadMoreButtonLock(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadMoreButtonLock,
    messages,
    messagesLoadMoreButton,
    selectedChannelId,
    userId
  ]);

  const handleAcceptGroupInvitation = useCallback(
    async (invitationChannelPath) => {
      const invitationChannelId =
        channelPathIdHash[invitationChannelPath] ||
        (await parseChannelPath(invitationChannelPath));
      if (!channelPathIdHash[invitationChannelPath]) {
        onUpdateChannelPathIdHash({
          channelId: invitationChannelId,
          pathId: invitationChannelPath
        });
      }
      const { channel, joinMessage } = await acceptInvitation(
        invitationChannelId
      );
      if (channel.id === invitationChannelId) {
        socket.emit('join_chat_group', channel.id);
        socket.emit('new_chat_message', {
          message: joinMessage,
          channel: {
            id: channel.id,
            channelName: channel.channelName,
            pathId: channel.pathId
          },
          newMembers: [{ id: userId, username, profilePicUrl }]
        });
        history.push(`/chat/${invitationChannelPath}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentChannel?.creatorId, selectedChannelId, userId]
  );

  const handleFavoriteClick = useCallback(async () => {
    if (!favoritingRef.current) {
      favoritingRef.current = true;
      try {
        const favorited = await putFavoriteChannel(selectedChannelId);
        onSetFavoriteChannel({ channelId: selectedChannelId, favorited });
        favoritingRef.current = false;
      } catch (error) {
        console.error(error);
        favoritingRef.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  const handleMessageSubmit = useCallback(
    async ({ content, rewardAmount, rewardReason, target }) => {
      setTextAreaHeight(0);
      let isFirstDirectMessage = selectedChannelId === 0;
      if (isFirstDirectMessage) {
        if (creatingNewDMChannel) return;
        onSetCreatingNewDMChannel(true);
        try {
          const { alreadyExists, channel, message, pathId } =
            await startNewDMChannel({
              content,
              userId,
              recepientId
            });
          if (alreadyExists) {
            return window.location.reload();
          }
          socket.emit('join_chat_group', message.channelId);
          socket.emit('send_bi_chat_invitation', {
            userId: recepientId,
            members: currentChannel.members,
            pathId,
            message
          });
          onUpdateChannelPathIdHash({ channelId: channel.id, pathId });
          onSendFirstDirectMessage({ channel, message });
          onSetCreatingNewDMChannel(false);
          history.replace(`/chat/${pathId}`);
          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      }
      const message = {
        userId,
        username,
        profilePicUrl,
        content,
        channelId: selectedChannelId,
        subjectId: isRespondingToSubject ? subjectId : null
      };
      const messageId = uuidv1();
      onSubmitMessage({
        messageId,
        message,
        replyTarget: target,
        rewardReason,
        rewardAmount,
        isRespondingToSubject
      });
      onSetReplyTarget({ channelId: selectedChannelId, target: null });
      return Promise.resolve();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      creatingNewDMChannel,
      isRespondingToSubject,
      profilePicUrl,
      recepientId,
      selectedChannelId,
      subjectId,
      userId,
      username
    ]
  );

  const handleRewardMessageSubmit = useCallback(
    async ({ amount, reasonId, message }) => {
      handleMessageSubmit({
        content: rewardReasons[reasonId].message,
        rewardAmount: amount,
        rewardReason: reasonId,
        target: message
      });
      await updateUserXP({
        amount,
        action: 'reward',
        target: 'chat',
        targetId: message.id,
        type: 'increase',
        userId: message.userId
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleMessageSubmit]
  );

  const handleSelectNewOwner = useCallback(
    async ({ newOwner, andLeave }) => {
      const notificationMsg = await changeChannelOwner({
        channelId: selectedChannelId,
        newOwner
      });
      socket.emit('new_channel_owner', {
        channelId: selectedChannelId,
        userId,
        username,
        profilePicUrl,
        newOwner,
        notificationMsg
      });
      if (andLeave) {
        handleLeaveChannel();
      }
      setSelectNewOwnerModalShown(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleLeaveChannel, profilePicUrl, selectedChannelId, userId, username]
  );

  return (
    <ErrorBoundary>
      {!channelHeaderShown && !banned?.chat && selectedChannelId !== 0 && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            alignItems: 'center',
            zIndex: 50000,
            top: '1rem',
            right: '1rem'
          }}
        >
          <DropdownButton
            skeuomorphic
            color="darkerGray"
            opacity={0.7}
            listStyle={{
              width: '15rem'
            }}
            direction="left"
            icon="bars"
            text={menuLabel}
            menuProps={menuProps}
          />
          <div
            style={{
              marginLeft: '1.5rem'
            }}
          >
            <div
              style={{ cursor: 'pointer', fontSize: '2rem' }}
              onClick={handleFavoriteClick}
              onMouseEnter={() => {
                if (!favorited) {
                  setAddToFavoritesShown(true);
                }
              }}
              onMouseLeave={() => setAddToFavoritesShown(false)}
            >
              <Icon
                color={Color.brownOrange()}
                icon={favorited ? 'star' : ['far', 'star']}
              />
            </div>
            <FullTextReveal
              direction="left"
              className="desktop"
              show={addToFavoritesShown && !favorited}
              text="Add to favorites"
              style={{
                marginTop: '0.5rem',
                fontSize: '1.3rem',
                width: 'auto',
                minWidth: null,
                maxWidth: null,
                padding: '1rem'
              }}
            />
          </div>
        </div>
      )}
      {selectedChannelIsOnCall && (
        <CallScreen style={{ height: CALL_SCREEN_HEIGHT }} />
      )}
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          position: relative;
        `}
        style={{
          height: containerHeight
        }}
      >
        {!loading && channelHeaderShown && (
          <ChannelHeader
            currentChannel={currentChannel}
            onInputFocus={() => ChatInputRef.current.focus()}
            onSetInviteUsersModalShown={setInviteUsersModalShown}
            onSetLeaveConfirmModalShown={setLeaveConfirmModalShown}
            onSetSettingsModalShown={setSettingsModalShown}
            selectedChannelId={selectedChannelId}
            onFavoriteClick={handleFavoriteClick}
          />
        )}
        {loading && <Loading />}
        <div
          className={css`
            padding: 0 1rem;
            height: 100%;
            display: flex;
            flex-direction: column-reverse;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
          `}
          ref={MessagesRef}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              zIndex: 1000
            }}
          >
            {newUnseenMessage && (
              <Button
                filled
                color="orange"
                style={{ opacity: 0.9 }}
                onClick={() => {
                  setNewUnseenMessage(false);
                  handleScrollToBottom();
                }}
              >
                New Message
              </Button>
            )}
          </div>
          <div
            style={{
              display: 'block',
              position: 'relative',
              width: '100%',
              padding: bottomPaddingHeight
            }}
          />
          {messages.map((message, index) => (
            <Message
              key={selectedChannelId + (message.id || 'newMessage' + index)}
              channelLoaded={loaded}
              channelId={selectedChannelId}
              channelName={channelName}
              chessCountdownNumber={chessCountdownNumber}
              chessOpponent={chessOpponent}
              currentChannel={currentChannel}
              index={index}
              isLastMsg={index === 0}
              isNotification={!!message.isNotification}
              loading={loading}
              message={message}
              style={{ border: '1px solid red' }}
              onAcceptGroupInvitation={handleAcceptGroupInvitation}
              onChessBoardClick={handleChessModalShown}
              onChessSpoilerClick={handleChessSpoilerClick}
              onDelete={handleShowDeleteModal}
              onReceiveNewMessage={handleReceiveNewMessage}
              onReplyClick={() => ChatInputRef.current.focus()}
              onRewardMessageSubmit={handleRewardMessageSubmit}
              onScrollToBottom={handleScrollToBottom}
              recepientId={recepientId}
              onSetBottomPadding={(height) => setBottomPaddingHeight(height)}
              onShowSubjectMsgsModal={({ subjectId, content }) =>
                setSubjectMsgsModal({ shown: true, subjectId, content })
              }
            />
          ))}
          {!loading && messagesLoadMoreButton && (
            <div
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <LoadMoreButton
                filled
                color="lightBlue"
                loading={loadMoreButtonLock}
                onClick={handleLoadMore}
              />
            </div>
          )}
        </div>
      </div>
      {hideModalShown && (
        <ConfirmModal
          onHide={() => setHideModalShown(false)}
          title="Hide Chat"
          onConfirm={handleHideChat}
        />
      )}
      {deleteModal.shown && (
        <ConfirmModal
          onHide={() =>
            setDeleteModal({ shown: false, filePath: '', messageId: null })
          }
          title="Remove Message"
          onConfirm={handleDelete}
        />
      )}
      {subjectMsgsModal.shown && (
        <SubjectMsgsModal
          subjectId={subjectMsgsModal.subjectId}
          subjectTitle={subjectMsgsModal.content}
          onHide={() =>
            setSubjectMsgsModal({
              shown: false,
              subjectId: null,
              content: ''
            })
          }
        />
      )}
      <div
        style={{
          background: Color.inputGray(),
          padding: '1rem',
          borderTop: `1px solid ${Color.borderGray()}`
        }}
      >
        <MessageInput
          innerRef={ChatInputRef}
          loading={loading}
          socketConnected={socketConnected}
          myId={userId}
          isRespondingToSubject={currentChannel.isRespondingToSubject}
          isTwoPeopleChannel={currentChannel.twoPeople}
          currentChannelId={selectedChannelId}
          currentChannel={currentChannel}
          onChessButtonClick={handleChessModalShown}
          onMessageSubmit={(content) =>
            handleMessageSubmit({ content, target: currentChannel.replyTarget })
          }
          onHeightChange={(height) => {
            if (height !== textAreaHeight) {
              setTextAreaHeight(height > 46 ? height : 0);
            }
          }}
          onSelectVideoButtonClick={() => setSelectVideoModalShown(true)}
          recepientId={recepientId}
          replyTarget={currentChannel.replyTarget}
          subjectId={subjectId}
        />
      </div>
      {chessModalShown && (
        <ChessModal
          currentChannel={currentChannel}
          channelId={selectedChannelId}
          countdownNumber={chessCountdownObj[selectedChannelId]}
          myId={userId}
          onConfirmChessMove={handleConfirmChessMove}
          onHide={() => onSetChessModalShown(false)}
          onSetChessCountdownObj={setChessCountdownObj}
          onSpoilerClick={handleChessSpoilerClick}
          opponentId={chessOpponent?.id}
          opponentName={chessOpponent?.username}
          socketConnected={socketConnected}
        />
      )}
      {inviteUsersModalShown && (
        <InviteUsersModal
          onHide={() => setInviteUsersModalShown(false)}
          currentChannel={currentChannel}
          selectedChannelId={selectedChannelId}
          onDone={handleInviteUsersDone}
        />
      )}
      {settingsModalShown && (
        <SettingsModal
          canChangeSubject={currentChannel.canChangeSubject}
          channelName={channelName}
          isClass={currentChannel.isClass}
          isClosed={currentChannel.isClosed}
          members={currentChannel.members}
          onHide={() => setSettingsModalShown(false)}
          onDone={handleEditSettings}
          channelId={selectedChannelId}
          onPurchaseSubject={() =>
            socket.emit('purchased_chat_subject', selectedChannelId)
          }
          onSelectNewOwner={handleSelectNewOwner}
          onScrollToBottom={handleScrollToBottom}
          theme={currentChannel.theme}
          unlockedThemes={currentChannel.unlockedThemes}
          userIsChannelOwner={currentChannel.creatorId === userId}
        />
      )}
      {leaveConfirmModalShown && (
        <ConfirmModal
          title="Leave Channel"
          onHide={() => setLeaveConfirmModalShown(false)}
          onConfirm={handleLeaveConfirm}
          disabled={leaving}
        />
      )}
      {selectVideoModalShown && (
        <SelectVideoModal
          onHide={() => setSelectVideoModalShown(false)}
          onSend={(videoId) => {
            handleMessageSubmit({
              content: `https://www.twin-kle.com/videos/${videoId}`,
              target: currentChannel.replyTarget
            });
            setSelectVideoModalShown(false);
          }}
        />
      )}
      {!!selectNewOwnerModalShown && (
        <SelectNewOwnerModal
          onHide={() => setSelectNewOwnerModalShown(false)}
          members={currentChannel.members}
          onSubmit={handleSelectNewOwner}
          isClass={currentChannel.isClass}
          andLeave
        />
      )}
    </ErrorBoundary>
  );

  function handleReceiveNewMessage() {
    if (MessagesRef.current.scrollTop < 0) {
      setNewUnseenMessage(true);
    }
  }

  function handleScrollToBottom() {
    if (mounted.current && MessagesRef.current) {
      MessagesRef.current.scrollTop = 0;
    }
  }

  function handleShowDeleteModal({ fileName, filePath, messageId }) {
    setDeleteModal({
      shown: true,
      fileName,
      filePath,
      messageId
    });
  }
}

export default memo(MessagesContainer);
