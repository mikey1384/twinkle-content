export default function InteractiveActions(dispatch) {
  return {
    onConcatDisplayedSlides({ interactiveId, newSlides }) {
      return dispatch({
        type: 'CONCAT_DISPLAYED_SLIDES',
        interactiveId,
        newSlides
      });
    },
    onLoadInteractive(interactive) {
      return dispatch({
        type: 'LOAD_INTERACTIVE',
        interactive
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
