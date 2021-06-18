import React from 'react';
import { WELCOME_MSG } from './constants';
import { getAstProps } from '../../helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const FONT_SIZE = '2rem';
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
  for (let element of jsxElements) {
    if (element.attributes?.length > 0 && element?.name?.name === 'p') {
      for (let attribute of element.attributes) {
        if (attribute?.name?.name === 'style') {
          const styleProps = attribute?.value?.expression?.properties;
          for (let prop of styleProps) {
            if (prop?.key?.name === 'fontSize') {
              fontSize = prop?.value?.value;
            }
            if (prop?.key?.name === 'fontWeight') {
              fontWeight = prop?.value?.value;
            }
          }
        }
      }
    }
  }
  if (fontSize === FONT_SIZE && fontWeight === 'bold') {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(fontSize)) {
    return onSetErrorMsg(`You forgot to enter the font size value`);
  }
  if (fontSize !== FONT_SIZE) {
    return onSetErrorMsg(`The font size must be ${FONT_SIZE}, not ${fontSize}`);
  }
  onSetErrorMsg(`The font weight should be bold`);
}
