export function buildPropsObj(stateProps, updatedPropValues) {
  const newProps = {};
  Object.keys(stateProps).forEach((name) => {
    newProps[name] = Object.assign({}, stateProps[name]);
  });
  Object.keys(updatedPropValues).forEach((name) => {
    newProps[name] = {
      value:
        typeof updatedPropValues[name] !== 'undefined'
          ? updatedPropValues[name]
          : stateProps[name].defaultValue,
      type: stateProps[name].type,
      options: stateProps[name].options,
      enumName: stateProps[name].enumName,
      description: stateProps[name].description,
      placeholder: stateProps[name].placeholder,
      hidden: stateProps[name].hidden,
      custom: stateProps[name].custom,
      stateful: stateProps[name].stateful,
      propHook: stateProps[name].propHook,
      imports: stateProps[name].imports,
      defaultValue: stateProps[name].defaultValue
    };
  });
  return newProps;
}
