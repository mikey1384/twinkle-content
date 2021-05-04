export default function MissionReducer(state, action) {
  switch (action.type) {
    case 'LOAD_MISSION': {
      return {
        ...state,
        prevUserId: action.prevUserId,
        missionObj: {
          ...state.missionObj,
          [action.mission.id]: {
            ...state.missionObj[action.mission.id],
            ...action.mission,
            tutorialId: action.mission.tutorialId || 0,
            loaded: true
          }
        }
      };
    }
    case 'LOAD_MISSION_TYPE_ID_HASH': {
      return {
        ...state,
        missionTypeIdHash: action.hash
      };
    }
    case 'LOAD_MISSION_LIST': {
      const newMissionObj = state.missionObj || {};
      for (let mission of action.missions) {
        newMissionObj[mission.id] = {
          ...newMissionObj[mission.id],
          ...mission,
          tutorialId: mission.tutorialId || 0
        };
      }
      let newMyAttempts = action.myAttempts;
      if (action.prevUserId === state.prevUserId) {
        for (let key in state.myAttempts) {
          if (newMyAttempts[key] && state.myAttempts[key]?.tryingAgain) {
            newMyAttempts[key].tryingAgain = true;
          }
        }
      }
      return {
        ...state,
        listLoaded: true,
        prevUserId: action.prevUserId,
        missions: action.missions.map(({ id }) => id),
        missionObj: newMissionObj,
        myAttempts: newMyAttempts,
        loadMoreButton: action.loadMoreButton
      };
    }
    case 'RESET_MISSION_STATE': {
      const newMissionObj = {};
      for (let [key, mission] of Object.entries(state.missionObj)) {
        newMissionObj[key] = {
          ...mission,
          loaded: false
        };
      }
      return {
        ...state,
        missionObj: newMissionObj
      };
    }
    case 'SET_MISSION_STATE': {
      return {
        ...state,
        missionObj: {
          ...state.missionObj,
          [action.missionId]: {
            ...state.missionObj[action.missionId],
            ...action.newState
          }
        }
      };
    }
    case 'SET_SELECTED_MISSION_LIST_TAB':
      return {
        ...state,
        selectedMissionListTab: action.selectedTab
      };
    case 'SET_MISSION_ATTEMPT': {
      return {
        ...state,
        myAttempts: {
          ...state.myAttempts,
          [action.missionId]: action.attempt
        }
      };
    }
    case 'UPDATE_MISSION_ATTEMPT': {
      return {
        ...state,
        myAttempts: {
          ...state.myAttempts,
          [action.missionId]: {
            ...state.myAttempts[action.missionId],
            ...action.newState
          }
        }
      };
    }
    default:
      return state;
  }
}
