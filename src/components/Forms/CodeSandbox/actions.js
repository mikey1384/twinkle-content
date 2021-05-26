import { parseCode } from './ast';

export const updateCode = (dispatch, newCode) => {
  dispatch({
    type: 'UPDATE_CODE',
    payload: newCode
  });
};
export const updateCodeAndProvider = (dispatch, newCode, providerValue) => {
  dispatch({
    type: 'UPDATE_CODE_AND_PROVIDER',
    payload: {
      code: newCode,
      providerValue
    }
  });
};
export const updateAll = (
  dispatch,
  newCode,
  componentName,
  propsConfig,
  parseProvider,
  customProps
) => {
  const propValues = {};
  const { parsedProps, parsedProvider } = parseCode(
    newCode,
    componentName,
    parseProvider
  );
  Object.keys(propsConfig).forEach((name) => {
    propValues[name] = propsConfig[name].value;
    if (customProps && customProps[name] && customProps[name].parse) {
      // custom prop parser
      propValues[name] = customProps[name].parse(
        parsedProps[name],
        propsConfig
      );
    } else if (propsConfig[name].type === 'date') {
      const match = parsedProps[name].match(
        /^new\s*Date\(\s*"([0-9-T:.Z]+)"\s*\)$/
      );
      if (match) {
        propValues[name] = match[1];
      } else {
        propValues[name] = parsedProps[name];
      }
    } else {
      propValues[name] = parsedProps[name];
    }
  });
  dispatch({
    type: 'UPDATE',
    payload: {
      code: newCode,
      updatedPropValues: propValues,
      providerValue: parsedProvider
    }
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
