export default function InteractiveReducer(state, action) {
  switch (action.type) {
    case 'ADD_NEW_INTERACTIVE_SLIDE':
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlides: state[action.interactiveId].displayedSlides.concat([
            action.slide.id
          ]),
          slideObj: {
            ...state[action.interactiveId].slideObj,
            [action.slide.id]: action.slide
          }
        }
      };
    case 'DELETE_INTERACTIVE_SLIDE': {
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          slideObj: {
            ...state[action.interactiveId].slideObj,
            [action.slideId]: {
              ...state[action.interactiveId].slideObj[action.slideId],
              isDeleted: true
            }
          }
        }
      };
    }
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
