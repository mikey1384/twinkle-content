import React from 'react';
import {
  getAstProps,
  filterElementsByType,
  getElementStyleProps
} from '../../helpers';

export const title = `Make a Button`;
export const instruction = (
  <>
    <div>
      Make a <b style={{ color: 'blue' }}>blue</b> button with <b>white</b> text
      that says {`"Welcome"`}
    </div>
    <div>
      Give the button a padding of <b>1rem</b>
    </div>
    <div>
      Make it so that when you tap/click the button you get a popup saying{' '}
      {`"Hello there"`}
    </div>
    <div style={{ marginTop: '2rem' }}>
      <button
        style={{ color: 'white', background: 'blue', padding: '1rem' }}
        onClick={() => alert('Hello there')}
      >
        Welcome
      </button>
    </div>
    <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
      This is what your button should look like. Try tapping/clicking it
    </div>
  </>
);
export const initialCode = `function HomePage() {
  return ();
}`;

export async function onRunCode({ ast, onUpdateMissionStatus, onSetErrorMsg }) {
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  let buttonColor = '';
  let buttonTextColor = '';
  const buttonElements = filterElementsByType({
    elements: jsxElements,
    filter: 'button'
  });
  const button = buttonElements[0];
  if (button) {
    const styleProps = getElementStyleProps(button.openingElement);
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
  const buttonIsBlue =
    buttonColor === 'blue' ||
    buttonColor.toLowerCase() === '#0000ff' ||
    buttonColor === 'rgb(0, 0, 255)' ||
    buttonColor === 'RGB(0, 0, 255)';
  const buttonTextColorIsWhite =
    buttonTextColor === 'white' ||
    buttonTextColor.toLowerCase() === '#fff' ||
    buttonTextColor === 'rgb(255, 255, 255)' ||
    buttonTextColor === 'RGB(255, 255, 255)';

  if (buttonIsBlue && buttonTextColorIsWhite) {
    return await onUpdateMissionStatus();
  }
  if (!button) {
    return onSetErrorMsg(`Where's the button?`);
  }
  if (!buttonColor) {
    return onSetErrorMsg(
      <>
        Please set the background color of the button to{' '}
        <span style={{ color: 'blue' }}>blue</span>
      </>
    );
  }
  if (!buttonIsBlue) {
    return onSetErrorMsg(
      <>
        The {`button's`} background color needs to be{' '}
        <span style={{ color: 'blue' }}>blue,</span> not {buttonColor}
      </>
    );
  }
  if (!buttonTextColor) {
    return onSetErrorMsg(
      <>
        Please set the color of the {`button's`} text to <b>white</b>
      </>
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
