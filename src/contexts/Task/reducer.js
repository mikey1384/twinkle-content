export default function TaskReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TASK': {
      return {
        ...state,
        taskObj: {
          ...state.taskObj,
          [action.task.id]: action.task
        }
      };
    }
    case 'LOAD_TASK_LIST': {
      const newTaskObj = {};
      for (let task of action.tasks) {
        newTaskObj[task.id] = { ...newTaskObj[task.id], ...task, loaded: true };
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
