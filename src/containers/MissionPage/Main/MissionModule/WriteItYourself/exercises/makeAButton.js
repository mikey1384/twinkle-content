import React from 'react';
import {
  getAstProps,
  filterElementsByType,
  getElementAttribute,
  getElementStyleProps,
  getElementInnerText,
  returnStyleErrorMsg
} from '../../helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const BUTTON_LABEL = 'Welcome';
const FONT_SIZE = '2rem';
const PADDING = '1rem';
const ALERT_TEXT = 'Hello there';

export const title = `Make a Button`;
export const instruction = (
  <>
    <div>
      Make a <b style={{ color: 'blue' }}>blue</b> button with <b>white</b> text
      that says{' '}
      <b>
        <i>{`${BUTTON_LABEL}`}</i>
      </b>
    </div>
    <div>
      Give the button a <b>padding</b> of <b>{`"${PADDING}"`}</b> and set its{' '}
      <b>fontSize</b> value to <b>{`"${FONT_SIZE}"`}</b>
    </div>
    <div>
      Make it so that when you tap/click the button you get a popup saying{' '}
      <b>
        <i>{`"${ALERT_TEXT}"`}</i>
      </b>
    </div>
    <div style={{ marginTop: '2rem' }}>
      <button
        style={{
          color: 'white',
          background: 'blue',
          padding: PADDING,
          fontSize: FONT_SIZE
        }}
        onClick={() => alert('Hello there')}
      >
        {BUTTON_LABEL}
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
  let buttonColor = '';
  let buttonTextColor = '';
  let buttonText = '';
  let buttonPadding = '';
  let alertText = '';
  let fontSize = '';
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  const buttonElements = filterElementsByType({
    elements: jsxElements,
    filter: 'button'
  });
  const button = buttonElements[0];
  let onClickFunc = null;
  if (button) {
    const styleProps = getElementStyleProps(button.openingElement);
    for (let prop of styleProps) {
      const propName = prop?.key?.name;
      const propValue = prop?.value?.value;
      if (propName === 'background' || propName === 'backgroundColor') {
        buttonColor = propValue;
      }
      if (propName === 'color') {
        buttonTextColor = propValue;
      }
      if (propName === 'padding') {
        buttonPadding = propValue;
      }
      if (propName === 'fontSize') {
        fontSize = propValue;
      }
    }
    buttonText = getElementInnerText(button);
    onClickFunc = getElementAttribute({
      openingElement: button.openingElement,
      attributeName: 'onClick'
    });
    if (onClickFunc?.value?.expression?.body?.callee?.name === 'alert') {
      alertText = onClickFunc?.value?.expression?.body?.arguments?.[0]?.value;
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
  const buttonTextMatches =
    buttonText.toLowerCase() === BUTTON_LABEL.toLowerCase();
  const buttonPaddingMatches = buttonPadding === PADDING;
  const fontSizeMatches = fontSize === FONT_SIZE;
  const alertTextMatches =
    alertText.trim().toLowerCase() === ALERT_TEXT.toLowerCase();

  if (
    buttonIsBlue &&
    buttonTextColorIsWhite &&
    buttonTextMatches &&
    buttonPaddingMatches &&
    fontSizeMatches &&
    alertTextMatches
  ) {
    return await onUpdateMissionStatus();
  }
  if (!button) {
    return onSetErrorMsg(`Where's the button?`);
  }
  if (!buttonIsBlue) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'button',
        propName: 'background',
        correctValue: 'blue',
        valueEntered: buttonColor
      })
    );
  }
  if (!buttonTextColorIsWhite) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'button',
        propName: 'color',
        correctValue: 'white',
        valueEntered: buttonTextColor
      })
    );
  }
  if (stringIsEmpty(buttonText)) {
    return onSetErrorMsg(`Hmmm... The button doesn't seem to have any label`);
  }
  if (!buttonTextMatches) {
    return onSetErrorMsg(
      `The button's label needs to be "${BUTTON_LABEL}," not "${buttonText.trim()}"`
    );
  }
  if (!buttonPaddingMatches) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'button',
        propName: 'padding',
        correctValue: PADDING,
        valueEntered: buttonPadding
      })
    );
  }
  if (!fontSizeMatches) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'button',
        propName: 'fontSize',
        correctValue: FONT_SIZE,
        valueEntered: fontSize
      })
    );
  }
  if (!onClickFunc) {
    return onSetErrorMsg(
      <>
        The button {`doesn't`} have an <b>onClick</b> property. Please check
        your code
      </>
    );
  }
  if (stringIsEmpty(alertText)) {
    return onSetErrorMsg(
      `Hmmm... The alert popup does not seem to have any message in it`
    );
  }
  if (!alertTextMatches) {
    return onSetErrorMsg(
      `The alert message should say, "${ALERT_TEXT}," not "${alertText.trim()}"`
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
