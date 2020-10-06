export default function MissionReducer(state, action) {
  switch (action.type) {
    case 'LOAD_MISSION': {
      return {
        ...state,
        missionObj: {
          ...state.missionObj,
          [action.mission.id]: {
            ...action.mission,
            tutorialId: action.mission.tutorialId || 0,
            loaded: true
          }
        }
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
      return {
        ...state,
        missions: action.missions.map(({ id }) => id),
        missionObj: newMissionObj,
        loadMoreButton: action.loadMoreButton
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
    default:
      return state;
  }
}
