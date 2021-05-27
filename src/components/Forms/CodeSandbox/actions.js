export const updateCode = (dispatch, newCode) => {
  dispatch({
    type: 'UPDATE_CODE',
    payload: newCode
  });
};
export const updatePropsAndCodeNoRecompile = (
  dispatch,
  newCode,
  propName,
  propValue
) => {
  dispatch({
    type: 'UPDATE_PROPS_AND_CODE_NO_RECOMPILE',
    payload: {
      codeNoRecompile: newCode,
      updatedPropValues: { [propName]: propValue }
    }
  });
};
export const updatePropsAndCode = (dispatch, newCode, propName, propValue) => {
  dispatch({
    type: 'UPDATE_PROPS_AND_CODE',
    payload: {
      code: newCode,
      updatedPropValues: { [propName]: propValue }
    }
  });
};
export const updateProps = (dispatch, propName, propValue) => {
  dispatch({
    type: 'UPDATE_PROPS',
    payload: { [propName]: propValue }
  });
};
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
