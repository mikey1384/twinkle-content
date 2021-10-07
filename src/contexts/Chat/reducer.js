import { initialChatState } from '.';
import { defaultChatSubject } from 'constants/defaultValues';
import { determineSelectedChatTab } from './helpers';
import { v1 as uuidv1 } from 'uuid';

export default function ChatReducer(state, action) {
  switch (action.type) {
    case 'ADD_ID_TO_NEW_MESSAGE':
      return {
        ...state,
        messageIds: state.messageIds.map((messageId, index) =>
          index === action.messageIndex ? action.messageId : messageId
        ),
        messagesObj: {
          ...state.messagesObj,
          [action.messageId]: {
            ...state.messagesObj.temp,
            id: action.messageId
          }
        }
      };
    case 'EDIT_CHANNEL_SETTINGS':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            isClosed: action.isClosed,
            canChangeSubject: action.canChangeSubject,
            theme: action.theme
          }
        },
        customChannelNames: {
          ...state.customChannelNames,
          [action.channelId]: action.channelName
        }
      };
    case 'CHANGE_ONLINE_STATUS': {
      return {
        ...state,
        chatStatus: {
          ...state.chatStatus,
          [action.userId]: state.chatStatus[action.userId]
            ? {
                ...state.chatStatus[action.userId],
                isOnline: action.isOnline,
                isAway: action.isOnline
                  ? false
                  : state.chatStatus[action.userId].isAway,
                isBusy: action.isOnline
                  ? false
                  : state.chatStatus[action.userId].isBusy
              }
            : {
                ...action.member,
                isOnline: action.isOnline
              }
        }
      };
    }
    case 'CHANGE_AWAY_STATUS': {
      return {
        ...state,
        chatStatus: {
          ...state.chatStatus,
          [action.userId]: state.chatStatus[action.userId]
            ? {
                ...state.chatStatus[action.userId],
                isAway: action.isAway
              }
            : undefined
        }
      };
    }
    case 'CHANGE_BUSY_STATUS': {
      return {
        ...state,
        chatStatus: {
          ...state.chatStatus,
          [action.userId]: state.chatStatus[action.userId]
            ? {
                ...state.chatStatus[action.userId],
                isBusy: action.isBusy
              }
            : undefined
        }
      };
    }
    case 'CHANGE_CALL_MUTED': {
      return {
        ...state,
        callMuted: action.muted
      };
    }
    case 'CHANGE_CHANNEL_OWNER': {
      const notificationId = uuidv1();
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            creatorId: action.newOwner.id,
            numUnreads: state.selectedChannelId === action.channelId ? 0 : 1,
            lastMessage: {
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            }
          }
        },
        messageIds:
          state.selectedChannelId === action.channelId
            ? state.messageIds.concat(notificationId)
            : state.messages,
        messagesObj: {
          ...state.messagesObj,
          [notificationId]: action.message
        }
      };
    }
    case 'CHANGE_CHANNEL_SETTINGS': {
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            channelName: action.channelName,
            isClosed: action.isClosed,
            canChangeSubject: action.canChangeSubject
          }
        }
      };
    }
    case 'CHANGE_SUBJECT': {
      return {
        ...state,
        subjectObj: {
          ...state.subjectObj,
          [action.channelId]: action.subject
        }
      };
    }
    case 'CHANNEL_LOADING_DONE': {
      return {
        ...state,
        channelLoading: false
      };
    }
    case 'CLEAR_CHAT_SEARCH_RESULTS':
      return {
        ...state,
        chatSearchResults: []
      };
    case 'CLEAR_NUM_UNREADS': {
      return {
        ...state,
        numUnreads: 0
      };
    }
    case 'CLEAR_RECENT_CHESS_MESSAGE': {
      return {
        ...state,
        recentChessMessage: undefined
      };
    }
    case 'CLEAR_SUBJECT_SEARCH_RESULTS':
      return {
        ...state,
        subjectSearchResults: []
      };
    case 'CLEAR_USER_SEARCH_RESULTS':
      return {
        ...state,
        userSearchResults: []
      };
    case 'CONFIRM_CALL_RECEPTION':
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          callReceived: true
        }
      };
    case 'CREATE_NEW_CHANNEL': {
      const { channelId } = action.data.message;
      const startMessageId = uuidv1();
      return {
        ...state,
        chatType: 'default',
        subject: {},
        homeChannelIds: [channelId].concat(state.homeChannelIds),
        favoriteChannelIds: [channelId].concat(state.favoriteChannelIds),
        allFavoriteChannelIds: {
          ...state.allFavoriteChannelIds,
          [channelId]: true
        },
        classChannelIds: action.data.isClass
          ? [channelId].concat(state.classChannelIds)
          : state.classChannelIds,
        channelsObj: {
          ...state.channelsObj,
          [channelId]: {
            id: channelId,
            channelName: action.data.message.channelName,
            lastMessage: {
              content: action.data.message.content,
              sender: {
                id: action.data.message.userId,
                username: action.data.message.username
              }
            },
            isClass: action.data.isClass,
            isClosed: action.data.isClosed,
            numUnreads: 0,
            twoPeople: false,
            creatorId: action.data.message.userId,
            members: action.data.members,
            unlockedThemes: []
          }
        },
        selectedChannelId: channelId,
        messageIds: [startMessageId],
        messagesObj: {
          ...state.messagesObj,
          [startMessageId]: action.data.message
        },
        messagesLoadMoreButton: false
      };
    }
    case 'CREATE_NEW_DM_CHANNEL': {
      const messageId = uuidv1();
      return {
        ...state,
        subject: {},
        homeChannelIds: [
          action.channel.id,
          ...state.homeChannelIds.filter((channelId) => channelId !== 0)
        ],
        channelsObj: {
          ...state.channelsObj,
          [action.channel.id]: {
            ...action.channel,
            numUnreads: 0,
            lastMessage: {
              fileName: action.message.fileName || '',
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            }
          }
        },
        selectedChannelId: action.channel.id,
        messageIds: [messageId],
        messagesObj: {
          ...state.messagesObj,
          [messageId]: action.message
        }
      };
    }
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messageIds: state.messageIds.filter(
          (messageId) => messageId !== action.messageId
        )
      };
    case 'DISPLAY_ATTACHED_FILE': {
      const newMessagesObj = { ...state.messagesObj };
      for (let messageId of state.messageIds) {
        const message = state.messagesObj[messageId];
        if (message.filePath !== action.filePath) {
          continue;
        }
        newMessagesObj[messageId] = {
          ...message,
          ...action.fileInfo,
          id: state.filesBeingUploaded[action.channelId]?.filter(
            (file) => file.filePath === action.filePath
          )?.[0]?.id,
          fileToUpload: undefined
        };
      }
      return {
        ...state,
        messagesObj: newMessagesObj
      };
    }
    case 'EDIT_MESSAGE':
      return {
        ...state,
        messagesObj: {
          ...state.messagesObj,
          [action.data.messageId]: {
            ...state.messagesObj[action.data.messageId],
            content: action.data.editedMessage
          }
        },
        subjectObj:
          action.isSubject && action.subjectChanged
            ? {
                ...state.subjectObj,
                [state.selectedChannelId]: {
                  ...state.subjectObj[state.selectedChannelId],
                  content: action.data.editedMessage
                }
              }
            : state.subjectObj
      };
    case 'EDIT_WORD':
      return {
        ...state,
        wordsObj: {
          ...state.wordsObj,
          [action.word]: {
            ...state.wordsObj[action.word],
            deletedDefIds: action.deletedDefIds,
            partOfSpeechOrder: action.partOfSpeeches,
            definitionOrder: action.editedDefinitionOrder
          }
        }
      };
    case 'ENABLE_CHAT_SUBJECT': {
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            canChangeSubject: 'owner'
          }
        }
      };
    }
    case 'ENABLE_THEME': {
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            unlockedThemes: [
              ...state.channelsObj[action.channelId].unlockedThemes,
              action.theme
            ]
          }
        }
      };
    }
    case 'ENTER_CHANNEL': {
      let messagesLoadMoreButton = false;
      let originalNumUnreads = 0;
      const selectedChannel = action.data.channel;
      if (action.data.messageIds.length === 21) {
        action.data.messageIds.pop();
        messagesLoadMoreButton = true;
      }
      action.data.messageIds.reverse();
      const newMessageIds = [...action.data.messageIds];
      const newMessagesObj = {
        ...action.data.messagesObj
      };
      const uploadStatusMessages = state.filesBeingUploaded[
        selectedChannel.id
      ]?.filter((message) => !message.uploadComplete);
      if (uploadStatusMessages) {
        for (let message of uploadStatusMessages) {
          const messageId = uuidv1();
          newMessageIds.push(messageId);
          newMessagesObj[messageId] = message;
        }
      }

      return {
        ...state,
        homeChannelIds: action.showOnTop
          ? [selectedChannel.id].concat(
              state.homeChannelIds.filter(
                (channelId) => channelId !== selectedChannel.id
              )
            )
          : state.homeChannelIds,
        selectedChatTab: determineSelectedChatTab({
          currentSelectedChatTab: state.selectedChatTab,
          selectedChannel
        }),
        recentChessMessage: undefined,
        channelsObj: {
          ...state.channelsObj,
          [selectedChannel.id]: selectedChannel
        },
        messageIds: newMessageIds,
        messagesObj: newMessagesObj,
        messagesLoaded: true,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        selectedChannelId: selectedChannel.id,
        messagesLoadMoreButton
      };
    }
    case 'ENTER_EMPTY_CHAT':
      return {
        ...state,
        chatType: 'default',
        recentChessMessage: undefined,
        subject: {},
        selectedChannelId: 0,
        messageIds: [],
        messagesLoadMoreButton: false
      };
    case 'GET_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: action.numUnreads
      };
    case 'HANG_UP': {
      const newChannelOnCallMembers = { ...state.channelOnCall.members };
      delete newChannelOnCallMembers[action.memberId];
      const newPeerStreams = { ...state.peerStreams };
      if (!action.iHungUp) {
        delete newPeerStreams[action.peerId];
      }
      return {
        ...state,
        myStream: action.iHungUp ? null : state.myStream,
        peerStreams: action.iHungUp ? {} : newPeerStreams,
        channelOnCall: {
          ...state.channelOnCall,
          callReceived: action.iHungUp
            ? false
            : state.channelOnCall?.callReceived,
          outgoingShown: action.iHungUp
            ? false
            : state.channelOnCall?.outgoingShown,
          imCalling: action.iHungUp ? false : state.channelOnCall?.imCalling,
          incomingShown: action.iHungUp
            ? false
            : state.channelOnCall?.incomingShown,
          members: newChannelOnCallMembers
        }
      };
    }
    case 'HIDE_ATTACHMENT':
      return {
        ...state,
        messagesObj: {
          ...state.messagesObj,
          [action.messageId]: {
            ...state.messagesObj[action.messageId],
            attachmentHidden: true
          }
        }
      };
    case 'HIDE_CHAT':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            isHidden: true
          }
        }
      };
    case 'INIT_CHAT': {
      const alreadyUsingChat =
        (!!state.selectedChannelId || state.selectedChannelId === 0) &&
        state.selectedChannelId !== action.data.currentChannelId;
      let messagesLoadMoreButton = false;
      let originalNumUnreads = 0;
      let classLoadMoreButton = false;
      let homeLoadMoreButton = false;
      let favoriteLoadMoreButton = false;
      let vocabActivitiesLoadMoreButton = false;
      const newMessageIds = alreadyUsingChat
        ? state.messageIds
        : action.data.messageIds;
      const newMessagesObj = {
        ...state.messagesObj,
        ...action.data.messagesObj
      };
      const uploadStatusMessages = state.filesBeingUploaded[
        action.data.currentChannelId
      ]?.filter((message) => !message.uploadComplete);
      if (uploadStatusMessages) {
        for (let message of uploadStatusMessages) {
          const messageId = uuidv1();
          newMessageIds.push(messageId);
          newMessagesObj[messageId] = message;
        }
      }
      if (!alreadyUsingChat) {
        if (action.data.messages && action.data.messages.length === 21) {
          action.data.messages.pop();
          messagesLoadMoreButton = true;
        }
        action.data.messageIds?.reverse();
      }
      if (action.data.homeChannelIds?.length > 20) {
        action.data.homeChannelIds.pop();
        homeLoadMoreButton = true;
      }
      if (action.data.classChannelIds?.length > 20) {
        action.data.classChannelIds.pop();
        classLoadMoreButton = true;
      }
      if (action.data.favoriteChannelIds?.length > 20) {
        action.data.favoriteChannelIds.pop();
        favoriteLoadMoreButton = true;
      }
      if (action.data.vocabActivities.length > 20) {
        action.data.vocabActivities.pop();
        vocabActivitiesLoadMoreButton = true;
      }
      action.data.vocabActivities?.reverse();

      return {
        ...state,
        ...initialChatState,
        chatStatus: state.chatStatus,
        allFavoriteChannelIds: action.data.allFavoriteChannelIds,
        chatType:
          state.chatType === 'vocabulary' ? 'vocabulary' : action.data.chatType,
        vocabActivities:
          state.chatType === 'vocabulary'
            ? state.vocabActivities
            : action.data.vocabActivities,
        vocabActivitiesLoadMoreButton:
          state.chatType === 'vocabulary'
            ? state.vocabActivitiesLoadMoreButton
            : vocabActivitiesLoadMoreButton,
        wordsObj: {
          ...state.wordsObj,
          ...action.data.wordsObj
        },
        wordCollectors: action.data.wordCollectors,
        loaded: true,
        classChannelIds: action.data.classChannelIds,
        favoriteChannelIds: action.data.favoriteChannelIds,
        homeChannelIds: action.data.homeChannelIds,
        channelsObj: {
          ...state.channelsObj,
          ...action.data.channelsObj,
          [action.data.currentChannelId]: {
            ...action.data.channelsObj[action.data.currentChannelId],
            numUnreads: 0
          }
        },
        classLoadMoreButton,
        favoriteLoadMoreButton,
        homeLoadMoreButton: alreadyUsingChat
          ? state.homeLoadMoreButton
          : homeLoadMoreButton,
        customChannelNames: action.data.customChannelNames,
        messagesLoadMoreButton,
        messageIds: newMessageIds,
        messagesObj: newMessagesObj,
        messagesLoaded: true,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        recentChessMessage: undefined,
        reconnecting: false,
        selectedChannelId:
          state.selectedChannelId || state.selectedChannelId === 0
            ? state.selectedChannelId
            : action.data.currentChannelId
      };
    }
    case 'INVITE_USERS_TO_CHANNEL':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [state.selectedChannelId]: {
            ...state.channelsObj[state.selectedChannelId],
            members: state.channelsObj[state.selectedChannelId].members.concat(
              action.data.selectedUsers.map((user) => ({
                id: user.id,
                username: user.username,
                profilePicUrl: user.profilePicUrl
              }))
            )
          }
        },
        messageIds: state.messageIds.concat(action.data.message.id),
        messagesObj: {
          ...state.messagesObj,
          [action.data.message.id]: action.data.message
        }
      };
    case 'LEAVE_CHANNEL':
      return {
        ...state,
        allFavoriteChannelIds: {
          ...state.allFavoriteChannelIds,
          [action.channelId]: false
        },
        favoriteChannelIds: state.favoriteChannelIds.filter(
          (channelId) => channelId !== action.channelId
        ),
        homeChannelIds: state.homeChannelIds.filter(
          (channelId) => channelId !== action.channelId
        ),
        classChannelIds: state.classChannelIds.filter(
          (channelId) => channelId !== action.channelId
        )
      };
    case 'LOAD_MORE_CHANNELS': {
      const chatTabHash = {
        home: 'homeChannelIds',
        favorite: 'favoriteChannelIds',
        class: 'classChannelIds'
      };
      let loadMoreButton = false;
      if (action.channelType === 'home') {
        if (action.channels.length > 20) {
          action.channels.pop();
          loadMoreButton = true;
        }
      }
      if (action.channelType === 'class') {
        if (action.channels.length > 20) {
          action.channels.pop();
          loadMoreButton = true;
        }
      }
      if (action.channelType === 'favorite') {
        if (action.channels.length > 20) {
          action.channels.pop();
          loadMoreButton = true;
        }
      }
      const channels = {};
      for (let channel of action.channels) {
        channels[channel.id] = channel;
      }
      return {
        ...state,
        ...{ [`${action.channelType}LoadMoreButton`]: loadMoreButton },
        [chatTabHash[action.channelType]]: state[
          chatTabHash[action.channelType]
        ].concat(action.channels.map((channel) => channel.id)),
        channelsObj: {
          ...state.channelsObj,
          ...channels
        }
      };
    }
    case 'LOAD_MORE_MESSAGES': {
      if (state.selectedChannelId !== action.loadedChannelId) return state;
      let messagesLoadMoreButton = false;
      if (action.messageIds.length === 21) {
        action.messageIds.pop();
        messagesLoadMoreButton = true;
      }
      action.messageIds.reverse();
      return {
        ...state,
        messagesLoadMoreButton,
        messageIds: action.messageIds.concat(state.messageIds),
        messagesObj: {
          ...state.messagesObj,
          ...action.messagesObj
        }
      };
    }
    case 'LOAD_SUBJECT':
      return {
        ...state,
        subjectObj: {
          ...state.subjectObj,
          [action.data.channelId]: {
            ...action.data,
            loaded: true
          }
        }
      };
    case 'LOAD_VOCABULARY': {
      let vocabActivitiesLoadMoreButton = false;
      if (action.vocabActivities.length > 20) {
        action.vocabActivities.pop();
        vocabActivitiesLoadMoreButton = true;
      }
      action.vocabActivities?.reverse();
      return {
        ...state,
        selectedChannelId: null,
        chatType: 'vocabulary',
        messages: [],
        messagesLoadMoreButton: false,
        vocabActivities: action.vocabActivities,
        vocabActivitiesLoadMoreButton,
        wordsObj: action.wordsObj,
        wordCollectors: action.wordCollectors
      };
    }
    case 'LOAD_MORE_VOCABULARY': {
      let vocabActivitiesLoadMoreButton = false;
      if (action.vocabActivities.length > 20) {
        action.vocabActivities.pop();
        vocabActivitiesLoadMoreButton = true;
      }
      action.vocabActivities?.reverse();
      return {
        ...state,
        selectedChannelId: null,
        chatType: 'vocabulary',
        messages: [],
        messagesLoadMoreButton: false,
        vocabActivities: action.vocabActivities.concat(state.vocabActivities),
        vocabActivitiesLoadMoreButton,
        wordsObj: {
          ...state.wordsObj,
          ...action.wordsObj
        }
      };
    }
    case 'LOAD_WORD_COLLECTORS':
      return {
        ...state,
        wordCollectors: action.wordCollectors
      };
    case 'NEW_SUBJECT':
      return {
        ...state,
        homeChannelIds: [
          action.channelId,
          ...state.homeChannelIds.filter(
            (channelId) => channelId !== action.channelId
          )
        ],
        subjectObj: {
          ...state.subjectObj,
          [action.channelId]: {
            ...state.subjectObj[action.channelId],
            ...action.subject
          }
        },
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            lastMessage: {
              content: action.subject.content,
              sender: {
                id: action.subject.userId,
                username: action.subject.username
              }
            }
          }
        },
        messages: state.messages.concat([
          {
            id: action.subject.id,
            channelId: action.channelId,
            ...action.subject
          }
        ])
      };
    case 'NOTIFY_MEMBER_LEFT': {
      const leaveMessage = 'left the chat group';
      let timeStamp = Math.floor(Date.now() / 1000);
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.data.channelId]: {
            ...state.channelsObj[action.data.channelId],
            lastMessage: {
              content: leaveMessage,
              sender: {
                id: action.data.userId,
                username: action.data.username
              }
            },
            numUnreads: 0,
            members: state.channelsObj[action.data.channelId].members.filter(
              (member) => member.id !== action.data.userId
            )
          }
        },
        messages: state.messages.concat([
          {
            id: null,
            channelId: action.data.channelId,
            content: leaveMessage,
            timeStamp: timeStamp,
            isNotification: true,
            username: action.data.username,
            userId: action.data.userId,
            profilePicUrl: action.data.profilePicUrl
          }
        ])
      };
    }
    case 'OPEN_DM': {
      let messagesLoadMoreButton = false;
      if (action.messageIds.length > 20) {
        action.messageIds.pop();
        messagesLoadMoreButton = true;
      }
      return {
        ...state,
        selectedChatTab: 'home',
        chatType: 'default',
        loaded: true,
        recentChessMessage: undefined,
        subject: {},
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            id: action.channelId,
            twoPeople: true,
            members: [action.user, action.recepient],
            channelName: action.recepient.username,
            lastMessage: action.lastMessage,
            numUnreads: 0
          }
        },
        selectedChannelId: action.channelId || 0,
        messageIds: action.messageIds.reverse(),
        messagesObj: {
          ...state.messagesObj,
          ...action.messagesObj
        },
        messagesLoadMoreButton,
        recepientId: action.recepient.id
      };
    }
    case 'OPEN_NEW_TAB':
      return {
        ...state,
        chatType: 'default',
        recentChessMessage: undefined,
        subject: {},
        homeChannelIds: [
          0,
          ...state.homeChannelIds.filter((channelId) => channelId !== 0)
        ],
        selectedChannelId: 0,
        channelsObj: {
          ...state.channelsObj,
          0: {
            id: 0,
            channelName: action.recepient.username,
            lastMessage: {
              content: null,
              sender: null
            },
            members: [action.user, action.recepient],
            numUnreads: 0,
            twoPeople: true
          }
        },
        messageIds: [],
        messagesLoadMoreButton: false,
        recepientId: action.recepient.id
      };
    case 'POST_FILE_UPLOAD_STATUS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[
            action.channelId
          ]?.concat(action.file) || [action.file]
        }
      };
    case 'POST_UPLOAD_COMPLETE':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            (file) =>
              file.filePath === action.path
                ? {
                    ...file,
                    id: action.messageId,
                    uploadComplete: action.result
                  }
                : file
          )
        }
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        numUnreads:
          action.pageVisible && action.usingChat
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        messageIds: state.messageIds.concat([action.message.id]),
        messagesObj: {
          ...state.messagesObj,
          [action.message.id]: action.message
        },
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            ...state.channelsObj[action.message.channelId],
            lastMessage: {
              isDraw: action.message.isDraw,
              fileName: action.message.fileName || '',
              gameWinnerId: action.message.gameWinnerId,
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            },
            members: [
              ...state.channelsObj[action.message.channelId].members,
              ...action.newMembers.filter(
                (newMember) =>
                  !state.channelsObj[action.message.channelId].members
                    .map((member) => member.id)
                    .includes(newMember.id)
              )
            ],
            numUnreads: 0,
            gameState: {
              ...state.channelsObj[action.message.channelId].gameState,
              ...(action.message.isChessMsg
                ? {
                    chess: {
                      ...state.channelsObj[action.message.channelId].gameState
                        ?.chess,
                      drawOfferedBy: null
                    }
                  }
                : action.message.isDrawOffer
                ? {
                    chess: {
                      ...state.channelsObj[action.message.channelId].gameState
                        ?.chess,
                      drawOfferedBy: action.message.userId
                    }
                  }
                : {})
            },
            isHidden: false
          }
        }
      };
    case 'RECEIVE_FIRST_MSG': {
      const messageId = uuidv1();
      return {
        ...state,
        numUnreads:
          action.duplicate && action.pageVisible
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        selectedChannelId: action.duplicate
          ? action.message.channelId
          : state.selectedChannelId,
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            id: action.message.channelId,
            isClass: action.isClass,
            members: action.message.members,
            channelName: action.message.channelName || action.message.username,
            lastMessage: {
              fileName: action.message.fileName || '',
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            },
            numUnreads: 1
          }
        },
        messagesObj: {
          ...state.messagesObj,
          ...(action.duplicate
            ? {
                [messageId]: {
                  id: messageId,
                  channelId: action.message.channelId,
                  content: action.message.content,
                  timeStamp: action.message.timeStamp,
                  username: action.message.username,
                  userId: action.message.userId,
                  profilePicUrl: action.message.profilePicUrl
                }
              }
            : {})
        },
        messageIds: action.duplicate ? [messageId] : state.messageIds,
        homeChannelIds: [action.message.channelId].concat(
          state.homeChannelIds.filter((channelId, index) =>
            action.duplicate ? index !== 0 : true
          )
        )
      };
    }
    case 'RECEIVE_MSG_ON_DIFF_CHANNEL':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channel.id]: {
            ...state.channelsObj[action.channel.id],
            ...action.channel,
            numUnreads:
              Number(state.channelsObj[action.channel.id]?.numUnreads || 0) + 1
          }
        },
        numUnreads:
          action.pageVisible && action.usingChat
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        favoriteChannelIds: state.allFavoriteChannelIds[action.channel.id]
          ? [action.channel.id].concat(
              state.favoriteChannelIds.filter(
                (channelId) => channelId !== action.channel.id
              )
            )
          : state.favoriteChannelIds,
        homeChannelIds: [action.channel.id].concat(
          state.homeChannelIds.filter(
            (channelId) => channelId !== action.channel.id
          )
        )
      };
    case 'RECEIVE_VOCAB_ACTIVITY':
      return {
        ...state,
        vocabActivities: state.vocabActivities.concat(action.activity.content),
        wordsObj: {
          ...state.wordsObj,
          [action.activity.content]: action.activity
        }
      };
    case 'REGISTER_WORD':
      return {
        ...state,
        vocabActivities: state.vocabActivities.concat(action.word.content),
        wordsObj: {
          ...state.wordsObj,
          [action.word.content]: {
            ...state.wordsObj[action.word.content],
            ...action.word,
            isNewActivity: true
          }
        }
      };
    case 'RELOAD_SUBJECT':
      return {
        ...state,
        subjectObj: {
          ...state.subjectObj,
          [action.channelId]: action.subject
        },
        messages: state.messages.concat([action.message]),
        homeChannelIds: [
          action.channelId,
          ...state.homeChannelIds.filter(
            (channelId) => channelId !== action.channelId
          )
        ],
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            lastMessage: {
              content: action.subject.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            }
          }
        }
      };
    case 'REMOVE_NEW_ACTIVITY_STATUS':
      return {
        ...state,
        wordsObj: {
          ...state.wordsObj,
          [action.word]: {
            ...state.wordsObj[action.word],
            isNewActivity: false
          }
        }
      };
    case 'RESET_CHAT':
      return initialChatState;
    case 'SEARCH':
      return {
        ...state,
        chatSearchResults: action.data
      };
    case 'SEARCH_SUBJECT':
      return {
        ...state,
        subjectSearchResults: action.data
      };
    case 'SEARCH_USERS_FOR_CHANNEL':
      return {
        ...state,
        userSearchResults: action.data
      };
    case 'SELECT_CHAT_TAB':
      return {
        ...state,
        selectedChatTab: determineSelectedChatTab({
          currentSelectedChatTab: state.selectedChatTab,
          selectedChatTab: action.selectedChatTab
        })
      };
    case 'SET_CALL': {
      return {
        ...state,
        channelOnCall: action.channelId
          ? {
              imCalling: action.imCalling,
              id: action.channelId,
              members: {}
            }
          : {}
      };
    }
    case 'SET_CHESS_MODAL_SHOWN':
      return {
        ...state,
        chessModalShown: action.shown
      };
    case 'SET_CREATING_NEW_DM_CHANNEL':
      return {
        ...state,
        creatingNewDMChannel: action.creating
      };
    case 'SET_CURRENT_CHANNEL_NAME':
      return {
        ...state,
        currentChannelName: action.channelName
      };
    case 'SET_FAVORITE_CHANNEL': {
      const filteredFavChannelIds = state.favoriteChannelIds.filter(
        (channelId) => channelId !== action.channelId
      );
      return {
        ...state,
        allFavoriteChannelIds: {
          ...state.allFavoriteChannelIds,
          [action.channelId]: action.favorited
        },
        favoriteChannelIds: action.favorited
          ? [action.channelId].concat(filteredFavChannelIds)
          : filteredFavChannelIds
      };
    }
    case 'SET_IS_RESPONDING_TO_SUBJECT':
      return {
        ...state,
        isRespondingToSubject: action.isResponding,
        replyTarget: null
      };
    case 'SET_LOADING_VOCABULARY':
      return {
        ...state,
        loadingVocabulary: action.loading
      };
    case 'SET_MEMBERS_ON_CALL':
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          members:
            Object.keys(action.members).length > 0
              ? {
                  ...state.channelOnCall.members,
                  ...action.members
                }
              : {}
        }
      };
    case 'SET_ONLINE_USER_DATA':
      return {
        ...state,
        chatStatus: {
          ...state.chatStatus,
          [action.profile.id]: action.profile
        }
      };
    case 'SET_MY_STREAM':
      return {
        ...state,
        myStream: action.stream
      };
    case 'SET_PEER_STREAMS':
      return {
        ...state,
        peerStreams: action.peerId
          ? {
              ...state.peerStreams,
              [action.peerId]: action.stream
            }
          : {}
      };
    case 'SET_RECONNECTING': {
      return {
        ...state,
        reconnecting: true
      };
    }
    case 'SET_REPLY_TARGET': {
      return {
        ...state,
        replyTarget: action.target,
        isRespondingToSubject: false
      };
    }
    case 'SET_VOCAB_ERROR_MESSAGE': {
      return {
        ...state,
        vocabErrorMessage: action.message
      };
    }
    case 'SET_WORDS_OBJECT': {
      return {
        ...state,
        wordsObj: {
          ...state.wordsObj,
          [action.wordObj.content]: {
            ...(state.wordsObj?.[action.wordObj.content] || {}),
            ...action.wordObj
          }
        }
      };
    }
    case 'SET_WORD_REGISTER_STATUS': {
      return {
        ...state,
        wordRegisterStatus: action.status
      };
    }
    case 'SHOW_INCOMING': {
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          incomingShown: true
        }
      };
    }
    case 'SHOW_OUTGOING': {
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          outgoingShown: true
        }
      };
    }
    case 'SUBMIT_MESSAGE': {
      const targetSubject = action.isRespondingToSubject
        ? {
            ...state.subjectObj[action.message.channelId],
            content:
              state.subjectObj[action.message.channelId].content ||
              defaultChatSubject
          }
        : null;
      return {
        ...state,
        isRespondingToSubject: false,
        homeChannelIds: action.message.isNotification
          ? state.homeChannelIds
          : [action.message.channelId].concat(
              state.homeChannelIds.filter(
                (channelId) => channelId !== action.message.channelId
              )
            ),
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            ...state.channelsObj[action.message.channelId],
            gameState: {
              ...state.channelsObj[action.message.channelId].gameState,
              ...(action.message.isChessMsg
                ? {
                    chess: {
                      ...state.channelsObj[action.message.channelId].gameState
                        ?.chess,
                      drawOfferedBy: null
                    }
                  }
                : action.message.isDrawOffer
                ? {
                    chess: {
                      ...state.channelsObj[action.message.channelId].gameState
                        ?.chess,
                      drawOfferedBy: action.message.userId
                    }
                  }
                : {})
            },
            lastMessage: {
              fileName: action.message.fileName || '',
              gameWinnerId: action.message.gameWinnerId,
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            },
            numUnreads: 0
          }
        },
        messageIds: state.messageIds.concat('temp'),
        messagesObj: {
          ...state.messagesObj,
          temp: {
            ...action.message,
            content: action.message.content,
            targetMessage: action.replyTarget,
            targetSubject
          }
        }
      };
    }
    case 'UPDATE_LAST_MESSAGE': {
      const newChannelsObj = { ...state.channelsObj };
      let newHomeChannelIds = [...state.homeChannelIds];
      const newTab = newChannelsObj[0];
      const newTabIsOpen = state.homeChannelIds.includes(0);
      for (let { id: channelId, isNew, channel } of action.channels) {
        if (isNew && newTabIsOpen) {
          const newTabMembers = newTab.members.map((member) => member.id);
          if (
            newTabMembers.includes(channel.members[0].id) &&
            newTabMembers.includes(channel.members[1].id)
          ) {
            newHomeChannelIds = [channelId, ...state.homeChannelIds].filter(
              (id) => id !== 0
            );
          }
        }
        if (newHomeChannelIds.includes(channelId)) {
          newChannelsObj[channelId] = {
            ...(isNew ? channel : newChannelsObj[channelId]),
            lastMessage: {
              ...(isNew ? {} : newChannelsObj[channelId].lastMessage),
              sender: action.sender,
              content: action.message
            }
          };
        }
      }
      return {
        ...state,
        homeChannelIds: newHomeChannelIds,
        channelsObj: newChannelsObj
      };
    }
    case 'TRIM_MESSAGES':
      return {
        ...state,
        messagesLoadMoreButton:
          state.messageIds.length > 20 ? true : state.messagesLoadMoreButton,
        messageIds:
          state.messageIds.length > 20
            ? state.messageIds.filter(
                (messageId, index) => index > state.messageIds.length - 20
              )
            : state.messageIds
      };
    case 'UPDATE_UPLOAD_PROGRESS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            (file) =>
              file.filePath === action.path
                ? {
                    ...file,
                    uploadProgress: action.progress
                  }
                : file
          )
        }
      };
    case 'UPDATE_CHESS_MOVE_VIEW_STAMP': {
      const newMessagesObj = { ...state.messagesObj };
      for (let messageId of state.messageIds) {
        const message = state.messagesObj[messageId];
        if (message.moveViewTimeStamp) {
          continue;
        }
        newMessagesObj[messageId].moveViewTimeStamp = Math.floor(
          Date.now() / 1000
        );
      }
      return {
        ...state,
        messagesObj: newMessagesObj
      };
    }
    case 'UPDATE_CLIENT_TO_API_SERVER_PROGRESS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            (file) =>
              file.filePath === action.path
                ? {
                    ...file,
                    clientToApiServerProgress: action.progress
                  }
                : file
          )
        }
      };
    case 'UPDATE_COLLECTORS_RANKINGS':
      return {
        ...state,
        wordCollectors:
          action.data.rankings ||
          updateWordCollectorsRankings({
            collector: action.data,
            currentRankings: state.wordCollectors
          })
      };
    case 'UPDATE_RECENT_CHESS_MESSAGE':
      return {
        ...state,
        recentChessMessage: action.message
      };
    case 'UPDATE_SELECTED_CHANNEL_ID':
      return {
        ...state,
        chatType: 'default',
        channelLoading: true,
        messageIds: [],
        messagesLoaded: false,
        messagesLoadMoreButton: false,
        selectedChannelId: action.channelId
      };
    default:
      return state;
  }
}

function updateWordCollectorsRankings({
  collector,
  currentRankings: { all = [], top30s = [] }
}) {
  const newAllRankings = all
    .filter((ranker) => ranker.username !== collector.username)
    .concat([collector]);
  newAllRankings.sort((a, b) => b.numWordsCollected - a.numWordsCollected);
  let newTop30s = top30s;
  if (collector.rank <= 30) {
    newTop30s = top30s
      .filter((ranker) => ranker.username !== collector.username)
      .concat([collector]);
  }
  newTop30s.sort((a, b) => b.numWordsCollected - a.numWordsCollected);
  return { all: newAllRankings.slice(0, 30), top30s: newTop30s };
}
