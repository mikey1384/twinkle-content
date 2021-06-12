import React from 'react';
import { WELCOME_MSG } from './constants';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

export const title = `Welcoming Your Visitors`;
export const instruction = (
  <>
    Type a message that says <b>{WELCOME_MSG}</b> between <b>{`<p>`}</b> and{' '}
    <b>{`</p>`}</b>
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
      <p></p>
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
