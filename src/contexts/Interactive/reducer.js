export default function InteractiveReducer(state, action) {
  switch (action.type) {
    case 'ADD_NEW_INTERACTIVE_SLIDE': {
      let newLastFork;
      if (action.lastFork) {
        const { selectedOptionId, paths } = action.lastFork;
        newLastFork = {
          ...action.lastFork,
          paths: {
            ...paths,
            [selectedOptionId]: paths[selectedOptionId].concat([
              action.slide.id
            ])
          }
        };
      }
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlideIds: state[action.interactiveId].displayedSlideIds
            .concat([action.slide.id])
            .filter((slideId) => {
              const slide = state[action.interactiveId].slideObj[slideId];
              return !(slide?.isFork && slide?.isDeleted);
            }),
          slideObj: {
            ...state[action.interactiveId].slideObj,
            ...(newLastFork
              ? {
                  [action.lastFork.id]: newLastFork
                }
              : {}),
            [action.slide.id]: action.slide
          }
        }
      };
    }
    case 'ARCHIVE_SLIDE': {
      return {
        [action.interactiveId]: {
          ...state[action.interactiveId],
          archivedSlideIds: state[
            action.interactiveId
          ].archivedSlideIds.concat([action.slideId]),
          displayedSlideIds: state[
            action.interactiveId
          ].displayedSlideIds.filter((slideId) => {
            return slideId !== action.slideId;
          })
        }
      };
    }
    case 'INSERT_INTERACTIVE_SLIDE': {
      const newDisplayedSlideIds = [
        ...state[action.interactiveId].displayedSlideIds
      ];
      const index = newDisplayedSlideIds.indexOf(action.slideId);
      newDisplayedSlideIds.splice(index, 0, action.newSlide.id);
      let newLastFork;
      if (action.forkedFrom) {
        const lastFork =
          state[action.interactiveId].slideObj[action.forkedFrom];
        const { selectedOptionId, paths } = lastFork;
        let newPath = [...lastFork.paths[selectedOptionId]];
        const index = newPath.indexOf(action.slideId);
        newPath.splice(index, 0, action.newSlide.id);
        newLastFork = {
          ...lastFork,
          paths: {
            ...paths,
            [selectedOptionId]: newPath
          }
        };
      }
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlideIds: newDisplayedSlideIds,
          slideObj: {
            ...state[action.interactiveId].slideObj,
            ...(newLastFork
              ? {
                  [newLastFork.id]: newLastFork
                }
              : {}),
            [action.newSlide.id]: action.newSlide
          }
        }
      };
    }
    case 'LOAD_INTERACTIVE': {
      return {
        ...state,
        [action.interactive.id]: action.interactive
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
    case 'MOVE_INTERACTIVE_SLIDE': {
      const { displayedSlideIds } = state[action.interactiveId];
      const index = displayedSlideIds.indexOf(action.slideId);
      const newDisplayedSlideIds = [...displayedSlideIds];
      if (action.direction === 'up') {
        const prevSlideId = displayedSlideIds[index - 1];
        newDisplayedSlideIds[index - 1] = action.slideId;
        newDisplayedSlideIds[index] = prevSlideId;
      } else {
        const nextSlideId = displayedSlideIds[index + 1];
        newDisplayedSlideIds[index] = nextSlideId;
        newDisplayedSlideIds[index + 1] = action.slideId;
      }
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          displayedSlideIds: newDisplayedSlideIds
        }
      };
    }
    case 'PUBLISH_INTERACTIVE': {
      return {
        ...state,
        [action.interactiveId]: {
          ...state[action.interactiveId],
          isPublished: true
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
          ].displayedSlideIds.filter((slideId) => {
            return slideId !== action.slideId;
          })
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
