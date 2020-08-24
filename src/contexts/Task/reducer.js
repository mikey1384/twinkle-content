export default function TaskReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.tasks,
        loadMoreButton: action.loadMoreButton
      };
    default:
      return state;
  }
}
