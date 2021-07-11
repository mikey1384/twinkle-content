export default function MissionActions(dispatch) {
  return {
    onLoadMission({ mission, prevUserId }) {
      return dispatch({
        type: 'LOAD_MISSION',
        mission,
        prevUserId
      });
    },
    onLoadMissionList({ missions, myAttempts, loadMoreButton, prevUserId }) {
      return dispatch({
        type: 'LOAD_MISSION_LIST',
        missions,
        loadMoreButton,
        myAttempts,
        prevUserId
      });
    },
    onLoadMissionTypeIdHash(hash) {
      return dispatch({
        type: 'LOAD_MISSION_TYPE_ID_HASH',
        hash
      });
    },
    onSetSelectedMissionsTab(selectedTab) {
      return dispatch({
        type: 'SET_SELECTED_MISSIONS_TAB',
        selectedTab
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
    onSetMissionAttempt({ missionId, attempt }) {
      return dispatch({
        type: 'SET_MISSION_ATTEMPT',
        missionId,
        attempt
      });
    },
    onSetMyMissionAttempts(myAttempts) {
      return dispatch({
        type: 'SET_MY_MISSION_ATTEMPTS',
        myAttempts
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
