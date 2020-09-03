export default function InteractiveReducer(state, action) {
  switch (action.type) {
    case 'LOAD_INTERACTIVE': {
      return {
        ...state,
        [action.interactive.id]: action.interactive
      };
    }
    default:
      return state;
  }
}
