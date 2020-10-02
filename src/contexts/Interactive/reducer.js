export default function InteractiveReducer(state, action) {
  switch (action.type) {
    case 'ADD_NEW_INTERACTIVE_SLIDE':
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlideIds: state[
            action.interactiveId
          ].displayedSlideIds.concat([action.slide.id]),
          slideObj: {
            ...state[action.interactiveId].slideObj,
            [action.slide.id]: action.slide
          }
        }
      };
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
          displayedSlideIds: state[
            action.interactiveId
          ].displayedSlideIds.concat(action.newSlides)
        }
      };
    }
    case 'RECOVER_ARCHIVED_SLIDE': {
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlideIds: state[
            action.interactiveId
          ].displayedSlideIds.concat(action.slideId),
          archivedSlideIds: state[action.interactiveId].archivedSlideIds.filter(
            (slideId) => slideId !== action.slideId
          )
        }
      };
    }
    case 'REMOVE_INTERACTIVE_SLIDE': {
      return {
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlideIds: state[
            action.interactiveId
          ].displayedSlideIds.filter((slideId) => slideId !== action.slideId)
        }
      };
    }
    case 'SET_DISPLAYED_SLIDES': {
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlideIds: action.newSlides
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
