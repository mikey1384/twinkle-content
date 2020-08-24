export default function TaskReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TASKS': {
      const newTaskObj = {};
      for (let task of action.tasks) {
        newTaskObj[task.id] = task;
      }
      return {
        ...state,
        tasks: action.tasks.map(({ id }) => id),
        taskObj: newTaskObj,
        loadMoreButton: action.loadMoreButton
      };
    }
    default:
      return state;
  }
}
