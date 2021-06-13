import React from 'react';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const PADDING = '3rem';
const MARGIN_TOP = '7rem';

export const title = `Margin and Padding`;
export const instruction = (
  <>
    Set the <b>top margin</b> of the <b style={{ color: 'blue' }}>Tap Me</b>{' '}
    button to <b>{`"${MARGIN_TOP}"`}</b> and its <b>padding</b> to{' '}
    <b>{`"${PADDING}"`}</b>
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
          color: "#D35400",
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
  for (let element of jsxElements) {
    if (element.attributes?.length > 0 && element?.name?.name === 'button') {
      for (let attribute of element.attributes) {
        if (attribute?.name?.name === 'style') {
          const styleProps = attribute?.value?.expression?.properties;
          for (let prop of styleProps) {
            if (prop?.key?.name === 'marginTop') {
              marginTop = prop?.value?.value;
            }
            if (prop?.key?.name === 'padding') {
              padding = prop?.value?.value;
            }
          }
        }
      }
    }
  }
  if (marginTop === MARGIN_TOP && padding === PADDING) {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(marginTop)) {
    return onSetErrorMsg(
      `Please set the top margin of the button to "${MARGIN_TOP}"`
    );
  }
  if (stringIsEmpty(padding)) {
    return onSetErrorMsg(
      `Please set the padding of the button to "${PADDING}"`
    );
  }
  if (marginTop !== MARGIN_TOP) {
    return onSetErrorMsg(
      `The button's top margin must be "${MARGIN_TOP}," not "${marginTop}"`
    );
  }
  if (padding !== PADDING) {
    return onSetErrorMsg(
      `The button's padding must be "${PADDING}," not "${padding}"`
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
