export default function MissionActions(dispatch) {
  return {
    onLoadMission(task) {
      return dispatch({
        type: 'LOAD_TASK',
        task
      });
    },
    onLoadMissionList({ missions, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_TASK_LIST',
        missions,
        loadMoreButton
      });
    }
  };
}
