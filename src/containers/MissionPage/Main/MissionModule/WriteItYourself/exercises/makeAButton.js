import React from 'react';
import {
  getAstProps,
  filterOpeningElementsByType,
  getElementAttribute
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
    propType: 'JSXOpeningElement'
  });
  let buttonColor = '';
  const buttonElements = filterOpeningElementsByType({
    elements: jsxElements,
    filter: 'button'
  });
  const button = buttonElements[0];
  if (button) {
    const style = getElementAttribute({
      openingElement: button,
      attributeName: 'style'
    });
    const styleProps = style?.value?.expression?.properties;
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
