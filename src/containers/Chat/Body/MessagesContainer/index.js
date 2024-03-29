import React, {
  memo,
  useCallback,
  useContext,
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
import WordleModal from '../../Modals/WordleModal';
import SelectVideoModal from '../../Modals/SelectVideoModal';
import SelectNewOwnerModal from '../../Modals/SelectNewOwnerModal';
import SettingsModal from '../../Modals/SettingsModal';
import CallScreen from './CallScreen';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import { v1 as uuidv1 } from 'uuid';
import {
  GENERAL_CHAT_ID,
  GENERAL_CHAT_PATH_ID,
  rewardReasons
} from 'constants/defaultValues';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import { socket } from 'constants/io';
import { isMobile, parseChannelPath } from 'helpers';
import { useTheme } from 'helpers/hooks';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext, useKeyContext } from 'contexts';
import LocalContext from '../../Context';
import localize from 'constants/localize';

const CALL_SCREEN_HEIGHT = '30%';
const unseenButtonThreshold = -1;
const deviceIsMobile = isMobile(navigator);
const addToFavoritesLabel = localize('addToFavorites');
const editGroupNameLabel = localize('editGroupName');
const hideLabel = localize('hide');
const invitePeopleLabel = localize('invitePeople');
const leaveChatGroupLabel = localize('leaveChatGroup');
const leaveLabel = localize('leave');
const menuLabel = deviceIsMobile ? '' : localize('menu');
const settingsLabel = localize('settings');

MessagesContainer.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object.isRequired,
  displayedThemeColor: PropTypes.string,
  loading: PropTypes.bool
};

function MessagesContainer({
  channelName,
  chessOpponent,
  currentChannel,
  displayedThemeColor,
  loading: channelLoading
}) {
  const reportError = useAppContext((v) => v.requestHelpers.reportError);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    actions: {
      onDeleteMessage,
      onEditChannelSettings,
      onEnterComment,
      onEnterChannelWithId,
      onGetRanks,
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
    },
    requests: {
      acceptInvitation,
      changeChannelOwner,
      deleteChatMessage,
      editChannelSettings,
      hideChat,
      leaveChannel,
      loadChatChannel,
      loadMoreChatMessages,
      loadRankings,
      putFavoriteChannel,
      sendInvitationMessage,
      startNewDMChannel,
      updateUserXP
    },
    state: {
      allFavoriteChannelIds,
      channelPathIdHash,
      channelOnCall,
      chessModalShown,
      creatingNewDMChannel,
      recepientId,
      reconnecting,
      selectedChannelId,
      socketConnected,
      subjectObj
    },
    inputState
  } = useContext(LocalContext);
  const { banned, profilePicUrl, userId, profileTheme, username } =
    useKeyContext((v) => v.myState);
  const {
    isRespondingToSubject = false,
    messageIds = [],
    messagesObj = {},
    messagesLoadMoreButton = false,
    wordleGuesses,
    wordleSolution,
    wordleWordLevel,
    wordleAttemptState,
    wordleStats,
    nextDayTimeStamp,
    twoPeople
  } = currentChannel;
  const {
    loadMoreButton: { color: loadMoreButtonColor }
  } = useTheme(twoPeople ? profileTheme : displayedThemeColor || profileTheme);

  const scrolledToBottomRef = useRef(true);
  const loadMoreButtonLock = useRef(false);
  const currentPathId = useMemo(() => pathname.split('chat/')[1], [pathname]);
  const textForThisChannel = useMemo(
    () => inputState['chat' + selectedChannelId]?.text || '',
    [selectedChannelId, inputState]
  );
  const [inputText, setInputText] = useState(textForThisChannel);
  const [chessCountdownObj, setChessCountdownObj] = useState({});
  const [wordleModalShown, setWordleModalShown] = useState(false);
  const [textAreaHeight, setTextAreaHeight] = useState(0);
  const [inviteUsersModalShown, setInviteUsersModalShown] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
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
  const MessagesRef = useRef(null);
  const ChatInputRef = useRef(null);
  const favoritingRef = useRef(false);
  const timerRef = useRef(null);
  const prevChannelId = useRef(null);
  const prevTopMessageId = useRef(null);
  const prevScrollPosition = useRef(null);
  const messages = useMemo(() => {
    const result = [];
    const dupe = {};
    for (let messageId of messageIds) {
      if (!dupe[messageId]) {
        const message = messagesObj[messageId];
        if (message) {
          result.push(message);
          dupe[messageId] = true;
        }
      }
    }
    return result;
  }, [messageIds, messagesObj]);

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

  const selectedChannelIdAndPathIdNotSynced = useMemo(() => {
    const pathId = Number(currentPathId);
    return (
      !isNaN(pathId) &&
      pathId !== 0 &&
      parseChannelPath(pathId) !== selectedChannelId
    );
  }, [currentPathId, selectedChannelId]);

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

  const loadingAnimationShown = useMemo(() => {
    return (
      channelLoading ||
      creatingNewDMChannel ||
      reconnecting ||
      selectedChannelIdAndPathIdNotSynced
    );
  }, [
    channelLoading,
    creatingNewDMChannel,
    reconnecting,
    selectedChannelIdAndPathIdNotSynced
  ]);

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
              <span style={{ marginLeft: '1rem' }}>{hideLabel}</span>
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
            <span style={{ marginLeft: '1rem' }}>{invitePeopleLabel}</span>
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
              <span style={{ marginLeft: '1rem' }}>{settingsLabel}</span>
            </>
          ) : (
            <>
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '1rem' }}>{editGroupNameLabel}</span>
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
            <span style={{ marginLeft: '1rem' }}>{leaveLabel}</span>
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
    onSetChessModalShown(false);
    setWordleModalShown(false);
    prevTopMessageId.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  useEffect(() => {
    const topMessageId = messageIds[messageIds.length - 1];
    if (
      prevChannelId.current === selectedChannelId &&
      prevTopMessageId.current &&
      topMessageId !== prevTopMessageId.current
    ) {
      if (deviceIsMobile) {
        (MessagesRef.current || {}).scrollTop = prevScrollPosition.current;
        (MessagesRef.current || {}).scrollTop =
          prevScrollPosition.current + 1000;
      }
      (MessagesRef.current || {}).scrollTop = prevScrollPosition.current;
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
      scrolledToBottomRef.current =
        (MessagesRef.current || {}).scrollTop >= unseenButtonThreshold;
      const scrollThreshold =
        (MessagesRef.current || {}).scrollHeight -
        (MessagesRef.current || {}).offsetHeight;
      const scrollTop = (MessagesRef.current || {}).scrollTop;
      const distanceFromTop = scrollThreshold + scrollTop;
      if (distanceFromTop < 3) {
        handleLoadMore();
      }
      if (scrollTop >= unseenButtonThreshold) {
        setNewUnseenMessage(false);
      }
    }
  });

  useEffect(() => {
    favoritingRef.current = false;
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

  const handleWordleModalShown = useCallback(() => {
    const channelId = currentChannel?.id;
    onSetReplyTarget({ channelId, target: null });
    setWordleModalShown(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel?.id]);

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
    async ({ state, isCheckmate, isStalemate, moveNumber }) => {
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
          onSetReplyTarget({ channelId: selectedChannelId, target: null });
          socket.emit(
            'user_made_a_move',
            {
              userId,
              channelId: selectedChannelId,
              moveNumber
            },
            (success) => {
              if (success) {
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
              }
              onSetChessModalShown(false);
            }
          );
        } else {
          if (selectedChannelId === 0 && !recepientId) {
            return reportError({
              componentPath: 'MessagesContainer/index',
              message: `handleConfirmChessMove: User is trying to send the first chess message to someone but recepient ID is missing`
            });
          }
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
          onSetChessModalShown(false);
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
        const recepientIds = [];
        for (let user of users) {
          if (!user.id) {
            return reportError({
              componentPath: 'MessagesContainer/index',
              message: `handleInviteUsersDone: User is trying to invite people to their channel but at least one of their user ID is missing. Channel ID was: ${selectedChannelId}`
            });
          }
          recepientIds.push(user.id);
        }
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
        onLeaveChannel({ channelId: selectedChannelId, userId });
        socket.emit('leave_chat_channel', {
          channelId: selectedChannelId,
          userId,
          username,
          profilePicUrl
        });
        navigate(`/chat/${GENERAL_CHAT_PATH_ID}`);
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
      if (!loadMoreButtonLock.current) {
        setLoadingMore(true);
        loadMoreButtonLock.current = true;
        prevScrollPosition.current =
          ((MessagesRef.current || {}).scrollHeight -
            (MessagesRef.current || {}).offsetHeight) *
          -1;
        try {
          const { messageIds, messagesObj, loadedChannelId } =
            await loadMoreChatMessages({
              userId,
              messageId,
              channelId: selectedChannelId
            });
          onLoadMoreMessages({ messageIds, messagesObj, loadedChannelId });
          setLoadingMore(false);
          loadMoreButtonLock.current = false;
        } catch (error) {
          console.error(error);
          setLoadingMore(false);
          loadMoreButtonLock.current = false;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, messagesLoadMoreButton, selectedChannelId, userId]);

  const handleAcceptGroupInvitation = useCallback(
    async (invitationChannelPath) => {
      const invitationChannelId =
        channelPathIdHash[invitationChannelPath] ||
        parseChannelPath(invitationChannelPath);
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
        navigate(`/chat/${invitationChannelPath}`);
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
        if (!recepientId) {
          return reportError({
            componentPath: 'MessagesContainer/index',
            message: `handleMessageSubmit: User is trying to send the first message to someone but recepient ID is missing. Content of the message was "${content}," and pathId was ${
              currentPathId ? `"${currentPathId}"` : 'empty'
            }`
          });
        }
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
      handleUpdateRankings();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleMessageSubmit]
  );

  const handleUpdateRankings = useCallback(async () => {
    const {
      all,
      top30s,
      allMonthly,
      top30sMonthly,
      myMonthlyRank,
      myAllTimeRank,
      myAllTimeXP,
      myMonthlyXP
    } = await loadRankings();
    onGetRanks({
      all,
      top30s,
      allMonthly,
      top30sMonthly,
      myMonthlyRank,
      myAllTimeRank,
      myAllTimeXP,
      myMonthlyXP
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <ErrorBoundary componentPath="MessagesContainer/index">
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
              text={addToFavoritesLabel}
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
        {!loadingAnimationShown && channelHeaderShown && (
          <ChannelHeader
            currentChannel={currentChannel}
            displayedThemeColor={displayedThemeColor}
            onInputFocus={() => ChatInputRef.current.focus()}
            onSetInviteUsersModalShown={setInviteUsersModalShown}
            onSetLeaveConfirmModalShown={setLeaveConfirmModalShown}
            onSetSettingsModalShown={setSettingsModalShown}
            selectedChannelId={selectedChannelId}
            onFavoriteClick={handleFavoriteClick}
          />
        )}
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column-reverse',
            overflowY: 'scroll'
          }}
          ref={MessagesRef}
        >
          {loadingAnimationShown ? (
            <Loading style={{ position: 'absolute', top: '5rem' }} />
          ) : (
            <>
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
              {messages.map((message, index) => (
                <Message
                  key={message.id || message.tempMessageId}
                  channelId={selectedChannelId}
                  channelName={channelName}
                  chessCountdownNumber={chessCountdownNumber}
                  chessOpponent={chessOpponent}
                  currentChannel={currentChannel}
                  displayedThemeColor={displayedThemeColor}
                  forceRefreshForMobile={handleForceRefreshForMobile}
                  index={index}
                  isLastMsg={index === 0}
                  isNotification={!!message.isNotification}
                  loading={loadingAnimationShown}
                  message={message}
                  onAcceptGroupInvitation={handleAcceptGroupInvitation}
                  onChessBoardClick={handleChessModalShown}
                  onChessSpoilerClick={handleChessSpoilerClick}
                  onDelete={handleShowDeleteModal}
                  onReceiveNewMessage={handleReceiveNewMessage}
                  onReplyClick={() => ChatInputRef.current.focus()}
                  onRewardMessageSubmit={handleRewardMessageSubmit}
                  onScrollToBottom={handleScrollToBottom}
                  recepientId={recepientId}
                  onShowSubjectMsgsModal={({ subjectId, content }) =>
                    setSubjectMsgsModal({ shown: true, subjectId, content })
                  }
                />
              ))}
              {!loadingAnimationShown &&
                (messagesLoadMoreButton ? (
                  <div>
                    <div style={{ width: '100%', height: '1rem' }} />
                    <div
                      style={{
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%'
                      }}
                    >
                      <LoadMoreButton
                        filled
                        color={loadMoreButtonColor}
                        loading={loadingMore}
                        onClick={handleLoadMore}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ paddingTop: '20rem' }} />
                ))}
            </>
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
          displayedThemeColor={displayedThemeColor}
          subjectId={subjectMsgsModal.subjectId}
          subjectTitle={subjectMsgsModal.content}
          channelId={selectedChannelId}
          theme={currentChannel.theme}
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
          selectedChannelId={selectedChannelId}
          innerRef={ChatInputRef}
          loading={loadingAnimationShown}
          socketConnected={socketConnected}
          myId={userId}
          inputText={inputText}
          onSetInputText={setInputText}
          isRespondingToSubject={currentChannel.isRespondingToSubject}
          isTwoPeopleChannel={currentChannel.twoPeople}
          currentChannel={currentChannel}
          onChessButtonClick={handleChessModalShown}
          onWordleButtonClick={handleWordleModalShown}
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
          textForThisChannel={textForThisChannel}
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
      {wordleModalShown && (
        <WordleModal
          channelId={selectedChannelId}
          channelName={channelName}
          attemptState={wordleAttemptState}
          guesses={wordleGuesses}
          solution={wordleSolution}
          wordLevel={wordleWordLevel}
          wordleStats={wordleStats}
          nextDayTimeStamp={nextDayTimeStamp}
          onHide={() => setWordleModalShown(false)}
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
          title={leaveChatGroupLabel}
          onHide={() => setLeaveConfirmModalShown(false)}
          onConfirm={handleLeaveConfirm}
          disabled={leaving}
        />
      )}
      {selectVideoModalShown && (
        <SelectVideoModal
          onHide={() => setSelectVideoModalShown(false)}
          onDone={(videoId) => {
            onEnterComment({
              contentType: 'chat',
              contentId: selectedChannelId,
              text: !stringIsEmpty(inputText)
                ? `${inputText.trim()} https://www.twin-kle.com/videos/${videoId}`
                : `https://www.twin-kle.com/videos/${videoId}`
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

  function handleForceRefreshForMobile() {
    const currentScrollTop = (MessagesRef.current || {}).scrollTop || 0;
    (MessagesRef.current || {}).scrollTop = currentScrollTop;
    (MessagesRef.current || {}).scrollTop = currentScrollTop - 1000;
    (MessagesRef.current || {}).scrollTop = currentScrollTop;
  }

  function handleReceiveNewMessage() {
    if (MessagesRef.current && !scrolledToBottomRef.current) {
      setNewUnseenMessage(true);
    } else {
      handleScrollToBottom();
    }
  }

  function handleScrollToBottom() {
    if (MessagesRef.current) {
      if (deviceIsMobile) {
        (MessagesRef.current || {}).scrollTop = 0;
        (MessagesRef.current || {}).scrollTop = -1000;
      }
      (MessagesRef.current || {}).scrollTop = 0;
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
