export default function TasksActions(dispatch) {
  return {
    onLoadTasks({ tasks, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_TASKS',
        tasks,
        loadMoreButton
      });
    }
  };
}
