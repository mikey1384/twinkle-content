export function getAstProps({ ast, propType }) {
  const results = [];
  for (let key in ast) {
    _getAstProps({ astProp: ast[key], propType });
  }

  function _getAstProps({ astProp, propType }) {
    if (astProp && typeof astProp === 'object') {
      if (
        (!propType && astProp?.type) ||
        (!!propType && astProp?.type === propType)
      ) {
        results.push(astProp);
      }
      for (let key in astProp) {
        _getAstProps({ astProp: astProp[key], propType });
      }
    }
  }
  return results;
}

export function filterElementByType({ elements, filter }) {
  const results = [];
  for (let element of elements) {
    if (element?.name?.name === filter) {
      results.push(element);
    }
  }
  return results;
}

export function getElementAttribute({ element, attributeName }) {
  if (element?.attributes?.length > 0) {
    for (let attribute of element.attributes) {
      if (attribute?.name?.name === attributeName) {
        return attribute;
      }
    }
  }
  return null;
}
