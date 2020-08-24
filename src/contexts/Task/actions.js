export default function TaskActions(dispatch) {
  return {
    onLoadTask(task) {
      return dispatch({
        type: 'LOAD_TASK',
        task
      });
    },
    onLoadTaskList({ tasks, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_TASK_LIST',
        tasks,
        loadMoreButton
      });
    }
  };
}
