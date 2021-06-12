import React from 'react';
import { WELCOME_MSG } from './constants';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

export const title = `5. Changing the font`;
export const instruction = (
  <>
    Change the `font weight` of your welcome message ({WELCOME_MSG}) to{' '}
    <b>{`"bold"`}</b> and change its `font size` to <b>{`"2rem"`}</b>. You can
    change its color to any color your want
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
          color: "white",
          background: "blue",
          border: "none",
          fontSize: "2rem",
          padding: "1rem",
          cursor: "pointer"
        }}
        onClick={() => alert('Hello World')}
      >
        Tap me
      </button>
    </div>
  );
}`;

export async function onRunCode({ ast, onSetErrorMsg, onUpdateMissionStatus }) {
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  let welcomeText = '';
  for (let element of jsxElements) {
    if (element.openingElement?.name?.name === 'p' && element?.children) {
      for (let child of element?.children) {
        welcomeText = child?.value || '';
      }
    }
  }
  if (
    welcomeText.trim().toLowerCase() === 'Welcome to my website!'.toLowerCase()
  ) {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(welcomeText)) {
    return onSetErrorMsg(
      `Hmmm... There doesn't seem to be any message between <p> and </p>`
    );
  }
  if (
    welcomeText.trim().toLowerCase() === 'Welcome to my website'.toLowerCase()
  ) {
    return onSetErrorMsg(
      `You forgot to add an exclamation mark (!) at the end`
    );
  }
  onSetErrorMsg(
    `The alert message should say, "Hello world," not "${welcomeText.trim()}"`
  );
}
