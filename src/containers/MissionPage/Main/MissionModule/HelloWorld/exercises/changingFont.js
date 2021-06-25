import React from 'react';
import { WELCOME_MSG } from './constants';
import {
  getAstProps,
  filterOpeningElementsByType,
  getElementStyleProps,
  returnStyleErrorMsg
} from '../../helpers';

const FONT_SIZE = '2rem';
const FONT_WEIGHT = 'bold';
export const title = `Changing the Font`;
export const instruction = (
  <>
    Change the `font weight` of your welcome message ({WELCOME_MSG}) to{' '}
    <b>{`"bold"`}</b> and change its `font size` to <b>{`"${FONT_SIZE}"`}</b>.
    You may change its color to any color your want
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
          color: "black",
          fontFamily: "sans-serif",
          fontWeight: "normal",
          fontSize: "1rem"
        }}
      >
        Welcome to My Website!
      </p>
      <button
        style={{
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
  let fontSize = '';
  let fontWeight = '';
  const paragraphs = filterOpeningElementsByType({
    elements: jsxElements,
    filter: 'p'
  });
  for (let paragraph of paragraphs) {
    const styleProps = getElementStyleProps(paragraph);
    for (let prop of styleProps) {
      if (prop?.key?.name === 'fontSize') {
        fontSize = prop?.value?.value;
      }
      if (prop?.key?.name === 'fontWeight') {
        fontWeight = prop?.value?.value;
      }
    }
  }
  if (fontSize === FONT_SIZE && fontWeight === FONT_WEIGHT) {
    return await onUpdateMissionStatus();
  }
  if (fontSize !== FONT_SIZE) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: '<p>',
        propName: 'fontSize',
        correctValue: FONT_SIZE,
        valueEntered: fontSize
      })
    );
  }
  if (fontWeight !== FONT_WEIGHT) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: '<p>',
        propName: 'fontWeight',
        correctValue: FONT_WEIGHT,
        valueEntered: fontWeight
      })
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
