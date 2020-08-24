export default function TaskActions(dispatch) {
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
