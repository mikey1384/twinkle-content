export const reset = (dispatch, initialCode, providerValue, propsConfig) => {
  dispatch({
    type: 'RESET',
    payload: {
      code: initialCode,
      props: propsConfig,
      providerValue
    }
  });
};
