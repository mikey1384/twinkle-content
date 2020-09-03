export default function InteractiveReducer(state, action) {
  switch (action.type) {
    case 'LOAD_INTERACTIVE': {
      return {
        ...state,
        [action.interactive.id]: {
          ...action.interactive,
          loaded: true
        }
      };
    }
    case 'CONCAT_DISPLAYED_SLIDES': {
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlides: state[action.interactiveId].displayedSlides.concat(
            action.newSlides
          )
        }
      };
    }
    case 'SET_DISPLAYED_SLIDES': {
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlides: action.newSlides
        }
      };
    }
    case 'SET_INTERACTIVE_STATE': {
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          slideObj: {
            ...state[action.interactiveId].slideObj,
            [action.slideId]: {
              ...state[action.interactiveId].slideObj[action.slideId],
              ...action.newState
            }
          }
        }
      };
    }
    default:
      return state;
  }
}
