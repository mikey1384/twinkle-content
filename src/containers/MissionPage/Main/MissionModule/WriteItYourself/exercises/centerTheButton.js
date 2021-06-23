import React from 'react';
import {
  getAstProps,
  filterOpeningElementsByType,
  getElementStyleProps
} from '../../helpers';

export const title = `Center the button`;
export const instruction = (
  <>
    <div>
      Surround the <b style={{ color: 'blue' }}>button</b> with a pair of{' '}
      <b>{`<div></div>`}</b> tags
    </div>
    <div>
      Set the width of the <b>{`<div>`}</b> to <b>{`"100%"`}</b>
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
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXOpeningElement'
  });
  let buttonColor = '';
  const buttonElements = filterOpeningElementsByType({
    elements: jsxElements,
    filter: 'button'
  });
  const button = buttonElements[0];
  if (button) {
    const styleProps = getElementStyleProps(button);
    for (let prop of styleProps) {
      if (
        prop?.key?.name === 'background' ||
        prop?.key?.name === 'backgroundColor'
      ) {
        buttonColor = prop?.value?.value;
        break;
      }
    }
  }
  if (
    buttonColor === 'blue' ||
    buttonColor.toLowerCase() === '#0000ff' ||
    buttonColor === 'rgb(0, 0, 255)'
  ) {
    return await onUpdateMissionStatus();
  }
  if (!buttonColor) {
    return onSetErrorMsg(
      <>
        Please change the color of the button to{' '}
        <span style={{ color: 'blue' }}>blue</span>
      </>
    );
  }
  onSetErrorMsg(
    <>
      The {`button's`} color needs to be{' '}
      <span style={{ color: 'blue' }}>blue,</span> not {buttonColor}
    </>
  );
}
