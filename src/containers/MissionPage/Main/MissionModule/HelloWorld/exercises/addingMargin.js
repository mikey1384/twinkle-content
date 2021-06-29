import React from 'react';
import {
  getAstProps,
  filterOpeningElementsByType,
  getElementStyleProps,
  returnStyleErrorMsg
} from '../../helpers';
import { stringsAreCaseInsensitiveEqual } from 'helpers/stringHelpers';

const PADDING = '3rem';
const MARGIN_TOP = '7rem';

export const title = `Margin and Padding`;
export const instruction = (
  <>
    Set the <b>marginTop</b> value of the{' '}
    <b style={{ color: 'blue' }}>Tap me</b> button to <b>{`"${MARGIN_TOP}"`}</b>{' '}
    and its <b>padding</b> to <b>{`"${PADDING}"`}</b>
  </>
);
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <p
        style={{
          color: "#4B9BE1",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fontSize: "2rem"
        }}
      >
        Welcome to My Website!
      </p>
      <button
        style={{
          marginTop: "0rem",
          padding: "1rem",
          color: "white",
          background: "blue",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer"
        }}
        onClick={() => alert("Hello World")}
      >
        Tap me
      </button>
    </div>
  );
}`;

export async function onRunCode({ ast, onSetErrorMsg, onUpdateMissionStatus }) {
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXOpeningElement'
  });
  let marginTop = '';
  let padding = '';
  const buttons = filterOpeningElementsByType({
    elements: jsxElements,
    filter: 'button'
  });
  const button = buttons[0];
  const styleProps = getElementStyleProps(button);
  for (let prop of styleProps) {
    if (prop?.key?.name === 'marginTop') {
      marginTop = prop?.value?.value;
    }
    if (prop?.key?.name === 'padding') {
      padding = prop?.value?.value;
    }
  }
  if (
    stringsAreCaseInsensitiveEqual(marginTop, MARGIN_TOP) &&
    stringsAreCaseInsensitiveEqual(padding, PADDING)
  ) {
    return await onUpdateMissionStatus();
  }
  if (!button) {
    return onSetErrorMsg('Did you delete the button?');
  }
  if (!stringsAreCaseInsensitiveEqual(marginTop, MARGIN_TOP)) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'button',
        propName: 'marginTop',
        correctValue: MARGIN_TOP,
        valueEntered: marginTop
      })
    );
  }
  if (!stringsAreCaseInsensitiveEqual(padding, PADDING)) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'button',
        propName: 'padding',
        correctValue: PADDING,
        valueEntered: padding
      })
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
