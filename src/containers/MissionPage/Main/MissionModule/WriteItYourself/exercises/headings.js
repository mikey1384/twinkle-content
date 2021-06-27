import React from 'react';
import {
  getAstProps,
  filterElementsByType,
  getElementStyleProps,
  returnStyleErrorMsg,
  returnInnerTextErrorMsg,
  getElementInnerText
} from '../../helpers';
import { Color } from 'constants/css';

const HEADING_LABEL = (username) => `${username}'s website`;
const SUBHEADING_LABEL = 'click the buttons below';
const MARGIN_BOTTOM = '10rem';

export const title = `Add a Heading and a Subheading`;
export const instruction = ({ username }) => (
  <>
    <div>
      Write{' '}
      <b>
        <i>{HEADING_LABEL(username)}</i>
      </b>{' '}
      between <b>{`<h1>`}</b> and <b>{`</h1>`}</b>
    </div>
    <div>
      This is your {`website's`} <b>heading</b>
    </div>
    <div style={{ marginTop: '2rem' }}>
      In the empty line right below <b>{`<h1>${username}'s website</h1>`}</b>,
    </div>
    <div>
      write{' '}
      <b>
        <i>{`<h2>${SUBHEADING_LABEL}</h2>`}</i>
      </b>
    </div>
    <div>
      This is your <b>subheading</b>
    </div>
    <div style={{ marginTop: '2rem' }}>
      Set your <b>subheading</b>
      {`'s`} <b>marginBottom</b> value to <b>{`"${MARGIN_BOTTOM}"`}</b>
    </div>
    <div style={{ marginTop: '2rem' }}>
      Tap the <b style={{ color: Color.logoBlue() }}>format</b> button
    </div>
  </>
);
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <h1></h1>

      <button
        style={{
          padding: "1rem",
          fontSize: "2rem",
          background: "blue",
          color: "white"
        }}
        onClick={() => alert("Hello there")}
      >
        Welcome
      </button>
      <button
        style={{
          padding: "1rem",
          fontSize: "2rem",
          background: "orange",
          color: "white",
          marginTop: "2rem"
        }}
        onClick={() => {
          let name = prompt("What's your name?");
          if (name) {
            alert("Nice to meet you, " + name + "!");
          } else {
            alert("Nice to meet you, stranger");
          }
        }}
      >
        {"What's your name?"}
      </button>
    </div>
  );
}`;

export async function onRunCode({
  ast,
  onUpdateMissionStatus,
  onSetErrorMsg,
  username
}) {
  let headingLabel = '';
  let subheadingLabel = '';
  let subheadingMarginBottom = '';
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  const headingElements = filterElementsByType({
    elements: jsxElements,
    filter: 'h1'
  });
  const headingElement = headingElements[0];
  const subheadingElements = filterElementsByType({
    elements: jsxElements,
    filter: 'h2'
  });
  const subheadingElement = subheadingElements[0];
  if (headingElement) {
    headingLabel = getElementInnerText(headingElement);
  }
  if (subheadingElement) {
    subheadingLabel = getElementInnerText(subheadingElement);
    const styleProps = getElementStyleProps(subheadingElement.openingElement);
    for (let prop of styleProps) {
      const propName = prop?.key?.name;
      const propValue = prop?.value?.value;
      if (propName === 'marginBottom') {
        subheadingMarginBottom = propValue;
      }
    }
  }
  const headingMatches =
    headingLabel.trim().toLowerCase() === HEADING_LABEL(username).toLowerCase();
  const subheadingMatches =
    subheadingLabel.trim().toLowerCase() === SUBHEADING_LABEL.toLowerCase();
  if (
    headingMatches &&
    subheadingMatches &&
    subheadingMarginBottom === MARGIN_BOTTOM
  ) {
    return await onUpdateMissionStatus();
  }
  if (!headingElement) {
    return onSetErrorMsg(
      <>
        {`Where's`} the <b>{`<h1></h1>`}</b> pair?
      </>
    );
  }
  if (!headingMatches) {
    return onSetErrorMsg(
      returnInnerTextErrorMsg({
        targetName: '<h1></h1>',
        correctValue: HEADING_LABEL(username),
        valueEntered: headingLabel
      })
    );
  }
  if (!subheadingElement) {
    return onSetErrorMsg(
      <>
        Please write <b>{`<h2>${SUBHEADING_LABEL}</h2>`}</b> in the empty line
        below the heading
      </>
    );
  }
  if (!subheadingMatches) {
    return onSetErrorMsg(
      returnInnerTextErrorMsg({
        targetName: '<h2></h2>',
        correctValue: SUBHEADING_LABEL,
        valueEntered: subheadingLabel
      })
    );
  }
  if (subheadingMarginBottom !== MARGIN_BOTTOM) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'subheading',
        propName: 'marginBottom',
        correctValue: MARGIN_BOTTOM,
        valueEntered: subheadingMarginBottom
      })
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
