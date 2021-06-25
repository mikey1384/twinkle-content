import React from 'react';

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

export function filterElementsByType({ elements, filter }) {
  const results = [];
  for (let element of elements) {
    if (element.openingElement.name.name === filter) {
      results.push(element);
    }
  }
  return results;
}

export function filterOpeningElementsByType({ elements, filter }) {
  const results = [];
  for (let element of elements) {
    if (element?.name?.name === filter) {
      results.push(element);
    }
  }
  return results;
}

export function getElementAttribute({ openingElement, attributeName }) {
  if (openingElement?.attributes?.length > 0) {
    for (let attribute of openingElement.attributes) {
      if (attribute?.name?.name === attributeName) {
        return attribute;
      }
    }
  }
  return null;
}

export function getElementStyleProps(openingElement) {
  const style = getElementAttribute({
    openingElement,
    attributeName: 'style'
  });
  const styleProps = style?.value?.expression?.properties || [];
  return styleProps;
}

export function getElementInnerText(element) {
  for (let child of element.children) {
    if (child.type === 'JSXText') {
      return child.value.trim();
    }
  }
  return '';
}

export function returnErrorMsg({
  elementName,
  propName,
  correctValue,
  valueEntered
}) {
  return (
    <>
      The <b>{propName}</b> value of the <b>{elementName}</b> must be set to{' '}
      <b>{correctValue}</b>
      {valueEntered ? `, not ${valueEntered}` : ''}
    </>
  );
}
