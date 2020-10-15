export default function MissionActions(dispatch) {
  return {
    onLoadMission(mission) {
      return dispatch({
        type: 'LOAD_MISSION',
        mission
      });
    },
    onLoadMissionList({ missions, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MISSION_LIST',
        missions,
        loadMoreButton
      });
    },
    onSetMissionState({ missionId, newState }) {
      return dispatch({
        type: 'SET_MISSION_STATE',
        missionId,
        newState
      });
    },
    onResetMissionState() {
      return dispatch({
        type: 'RESET_MISSION_STATE'
      });
    }
  };
}
