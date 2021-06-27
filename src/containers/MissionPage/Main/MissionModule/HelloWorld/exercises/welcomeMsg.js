import React from 'react';
import { WELCOME_MSG } from './constants';
import {
  getAstProps,
  filterElementsByType,
  returnInnerTextErrorMsg
} from '../../helpers';

export const title = `Welcoming Your Visitors`;
export const instruction = (
  <>
    Type a message that says{' '}
    <b>
      <i>{WELCOME_MSG}</i>
    </b>{' '}
    between <b>{`<p>`}</b> and <b>{`</p>`}</b>
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
    propType: 'JSXElement'
  });
  let welcomeText = '';
  const paragraphs = filterElementsByType({
    elements: jsxElements,
    filter: 'p'
  });
  for (let paragraph of paragraphs) {
    for (let child of paragraph?.children) {
      welcomeText = child?.value || '';
    }
  }
  if (welcomeText.trim().toLowerCase() === WELCOME_MSG.toLowerCase()) {
    return await onUpdateMissionStatus();
  }
  if (
    welcomeText.trim().toLowerCase() === WELCOME_MSG.slice(0, -1).toLowerCase()
  ) {
    return onSetErrorMsg(
      `You forgot to add an exclamation mark (!) at the end`
    );
  }
  if (welcomeText.trim().toLowerCase() !== WELCOME_MSG.toLowerCase()) {
    return onSetErrorMsg(
      returnInnerTextErrorMsg({
        targetName: '<p></p>',
        correctValue: WELCOME_MSG,
        valueEntered: welcomeText
      })
    );
  }
  onSetErrorMsg(
    `The alert message should say, "${WELCOME_MSG}," not "${welcomeText.trim()}"`
  );
}
