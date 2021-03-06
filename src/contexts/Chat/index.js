import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ChatActions from './actions';
import ChatReducer from './reducer';

export const ChatContext = createContext();

export const initialChatState = {
  allFavoriteChannelIds: {},
  callMuted: false,
  classLoadMoreButton: false,
  favoriteLoadMoreButton: false,
  homeLoadMoreButton: false,
  classChannelIds: [],
  favoriteChannelIds: [],
  homeChannelIds: [],
  channelsObj: {},
  channelOnCall: {},
  chatSearchResults: [],
  chatType: null,
  chessModalShown: false,
  creatingNewDMChannel: false,
  currentChannelName: '',
  customChannelNames: {},
  filesBeingUploaded: {},
  isRespondingToSubject: false,
  loadingVocabulary: false,
  loaded: false,
  messages: [],
  messagesLoadMoreButton: false,
  msgsWhileInvisible: 0,
  numUnreads: 0,
  peerStreams: {},
  recentChessMessage: undefined,
  recepientId: null,
  replyTarget: null,
  channelLoading: true,
  myStream: null,
  selectedChannelId: null,
  selectedChatTab: 'home',
  subjectObj: {},
  subjectSearchResults: [],
  vocabErrorMessage: '',
  wordCollectors: {},
  wordRegisterStatus: undefined,
  wordsObj: {},
  userSearchResults: [],
  vocabActivities: [],
  vocabActivitiesLoadMoreButton: false
};

ChatContextProvider.propTypes = {
  children: PropTypes.node
};

export function ChatContextProvider({ children }) {
  const [chatState, chatDispatch] = useReducer(ChatReducer, initialChatState);
  return (
    <ChatContext.Provider
      value={{
        state: chatState,
        actions: ChatActions(chatDispatch)
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
