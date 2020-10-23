export default function InteractiveActions(dispatch) {
  return {
    onAddNewInteractiveSlide({ interactiveId, lastFork, slide }) {
      return dispatch({
        type: 'ADD_NEW_INTERACTIVE_SLIDE',
        interactiveId,
        lastFork,
        slide
      });
    },
    onArchiveSlide({ interactiveId, slideId }) {
      return dispatch({
        type: 'ARCHIVE_SLIDE',
        interactiveId,
        slideId
      });
    },
    onConcatDisplayedSlides({ interactiveId, newSlides }) {
      return dispatch({
        type: 'CONCAT_DISPLAYED_SLIDES',
        interactiveId,
        newSlides
      });
    },
    onInsertInteractiveSlide({ interactiveId, forkedFrom, slideId, newSlide }) {
      return dispatch({
        type: 'INSERT_INTERACTIVE_SLIDE',
        interactiveId,
        forkedFrom,
        slideId,
        newSlide
      });
    },
    onLoadInteractive(interactive) {
      return dispatch({
        type: 'LOAD_INTERACTIVE',
        interactive
      });
    },
    onMoveInteractiveSlide({ direction, interactiveId, slideId }) {
      return dispatch({
        type: 'MOVE_INTERACTIVE_SLIDE',
        direction,
        interactiveId,
        slideId
      });
    },
    onPublishInteractive(interactiveId) {
      return dispatch({
        type: 'PUBLISH_INTERACTIVE',
        interactiveId
      });
    },
    onRecoverArchivedSlide({ interactiveId, slideId }) {
      return dispatch({
        type: 'RECOVER_ARCHIVED_SLIDE',
        interactiveId,
        slideId
      });
    },
    onRemoveInteractiveSlide({ interactiveId, slideId }) {
      return dispatch({
        type: 'REMOVE_INTERACTIVE_SLIDE',
        interactiveId,
        slideId
      });
    },
    onSetDisplayedSlides({ interactiveId, newSlides }) {
      return dispatch({
        type: 'SET_DISPLAYED_SLIDES',
        interactiveId,
        newSlides
      });
    },
    onSetInteractiveState({ interactiveId, slideId, newState }) {
      return dispatch({
        type: 'SET_INTERACTIVE_STATE',
        interactiveId,
        slideId,
        newState
      });
    }
  };
}
