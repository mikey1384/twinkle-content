export default function MissionReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TASK': {
      return {
        ...state,
        missionObj: {
          ...state.missionObj,
          [action.mission.id]: action.task
        }
      };
    }
    case 'LOAD_TASK_LIST': {
      const newMissionObj = {};
      for (let mission of action.missions) {
        newMissionObj[mission.id] = {
          ...newMissionObj[mission.id],
          ...mission,
          loaded: true
        };
      }
      return {
        ...state,
        missions: action.missions.map(({ id }) => id),
        missionObj: newMissionObj,
        loadMoreButton: action.loadMoreButton
      };
    }
    default:
      return state;
  }
}
