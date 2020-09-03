export default function InteractiveActions(dispatch) {
  return {
    onLoadInteractive(interactive) {
      return dispatch({
        type: 'LOAD_INTERACTIVE',
        interactive
      });
    }
  };
}
