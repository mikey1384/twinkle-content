import { initialNotiState } from '.';

export default function NotiReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_SOCKET_STATUS':
      return {
        ...state,
        socketConnected: action.connected
      };
    case 'CHAT_SUBJECT_CHANGE':
      return {
        ...state,
        currentChatSubject: {
          ...state.currentChatSubject,
          ...action.subject
        }
      };
    case 'CHECK_VERSION':
      return {
        ...state,
        versionMatch: action.data.match,
        updateDetail: action.data.updateDetail
      };
    case 'CLEAR_REWARDS':
      return {
        ...state,
        totalRewardedTwinkles: 0,
        totalRewardedTwinkleCoins: 0,
        loadMore: {
          ...state.loadMore,
          rewards: false
        }
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...initialNotiState,
        socketConnected: state.socketConnected,
        updateDetail: state.updateDetail,
        updateNoticeShown: state.updateNoticeShown
      };
    case 'INCREASE_NUM_NEW_NOTIS':
      return {
        ...state,
        numNewNotis: state.numNewNotis + 1
      };
    case 'INCREASE_NUM_NEW_POSTS':
      return {
        ...state,
        numNewPosts: state.numNewPosts + 1
      };
    case 'LOAD_MORE_NOTIFICATIONS':
      return {
        ...state,
        notifications: state.notifications.concat(action.data.notifications),
        loadMore: {
          ...state.loadMore,
          ...action.data.loadMore
        }
      };
    case 'LOAD_NOTIFICATIONS':
      return {
        ...state,
        ...action.data,
        numNewNotis: 0
      };
    case 'LOAD_MORE_REWARDS':
      return {
        ...state,
        rewards: state.rewards.concat(action.data.rewards),
        loadMore: {
          ...state.loadMore,
          rewards: action.data.loadMore
        }
      };
    case 'LOAD_RANKS':
      return {
        ...state,
        allRanks: action.all,
        top30s: action.top30s,
        rankingsLoaded: true
      };
    case 'RESET_NUM_NEW_POSTS':
      return {
        ...state,
        numNewPosts: 0
      };
    case 'RESET_REWARDS':
      return {
        ...state,
        rewards:
          state.totalRewardedTwinkles + state.totalRewardedTwinkleCoins === 0
            ? []
            : state.rewards
      };
    case 'SET_PREV_USER_ID_FOR_NOTIFICATION':
      return {
        ...state,
        prevUserId: action.userId
      };
    case 'SHOW_UPDATE_NOTICE':
      return {
        ...state,
        updateNoticeShown: action.shown
      };
    default:
      return state;
  }
}
