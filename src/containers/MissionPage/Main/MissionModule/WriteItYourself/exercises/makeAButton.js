import React from 'react';
import { Color } from 'constants/css';
import {
  getAstProps,
  filterOpeningElementsByType,
  getElementAttribute
} from '../../helpers';

export const title = `Make a Button`;
export const instruction = (
  <>
    Change the color of the <b style={{ color: 'red' }}>red</b> button below to{' '}
    <b style={{ color: 'blue' }}>{`"blue"`}</b> and tap the{' '}
    <b style={{ color: Color.green() }}>check</b> button
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
