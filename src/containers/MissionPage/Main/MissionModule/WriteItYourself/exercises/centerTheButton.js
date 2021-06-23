import React from 'react';
import {
  getAstProps,
  filterElementsByType,
  getElementStyleProps
} from '../../helpers';

const WIDTH = '100%';

export const title = `Center the button`;
export const instruction = (
  <>
    <div>
      Surround the <b style={{ color: 'blue' }}>button</b> with a pair of{' '}
      <b>{`<div></div>`}</b> tags
    </div>
    <div>
      Set the width of the <b>{`<div>`}</b> to <b>{`"${WIDTH}"`}</b>
    </div>
    <div>
      Set the <b>{`<div>`}</b>
      {`'s`} <b>display</b> value to <b>{`"flex"`}</b> and its{' '}
      <b>justifyContent</b> value to <b>{`"center"`}</b>
    </div>
  </>
);
export const initialCode = `function HomePage() {
  return (
    <button
      style={{
        padding: "1rem",
        fontSize: "2rem",
        background: "blue",
        color: "white"
      }}
      onClick={() => alert("Hello there")}
    >
      Welcome
    </button>
  );
}`;

export async function onRunCode({ ast, onUpdateMissionStatus, onSetErrorMsg }) {
  let divWidth = '';
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  const divElements = filterElementsByType({
    elements: jsxElements,
    filter: 'div'
  });
  const divElement = divElements[0];
  if (divElement) {
    const styleProps = getElementStyleProps(divElement.openingElement);
    for (let prop of styleProps) {
      const propName = prop?.key?.name;
      const propValue = prop?.value?.value;
      if (propName === 'width') {
        divWidth = propValue;
        break;
      }
    }
  }
  if (divWidth === '100%') {
    return await onUpdateMissionStatus();
  }
  if (!divElement) {
    return onSetErrorMsg(
      <>
        {`Where's`} the <b>{`<div></div>`}</b> pair?
      </>
    );
  }
  if (!divWidth) {
    return onSetErrorMsg(
      <>
        Please set the width of the <b>{`<div>`}</b> to <b>{`"100%"`}</b>
      </>
    );
  }
  if (divWidth !== WIDTH) {
    return onSetErrorMsg(
      <>
        The width of the <b>{`<div>`}</b> must be <b>100%</b>, not {divWidth}
      </>
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
