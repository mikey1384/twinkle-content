export default function MissionActions(dispatch) {
  return {
    onLoadMission({ mission, prevUserId }) {
      return dispatch({
        type: 'LOAD_MISSION',
        mission,
        prevUserId
      });
    },
    onLoadMissionList({ missions, loadMoreButton, prevUserId }) {
      return dispatch({
        type: 'LOAD_MISSION_LIST',
        missions,
        loadMoreButton,
        prevUserId
      });
    },
    onLoadMissionTypeIdHash(hash) {
      return dispatch({
        type: 'LOAD_MISSION_TYPE_ID_HASH',
        hash
      });
    },
    onSetSelectedMissionListTab(selectedTab) {
      return dispatch({
        type: 'SET_SELECTED_MISSION_LIST_TAB',
        selectedTab
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
    },
    onUpdateMissionAttempt({ missionId, newState }) {
      return dispatch({
        type: 'UPDATE_MISSION_ATTEMPT',
        missionId,
        newState
      });
    }
  };
}
