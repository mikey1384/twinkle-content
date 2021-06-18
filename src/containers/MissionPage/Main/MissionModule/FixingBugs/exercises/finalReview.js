import React from 'react';
import { getAstProps } from '../../helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const CONTAINER_FLEX_DIRECTION = 'column';
const CONTAINER_ALIGN_ITEMS = 'center';

export const title = `Let's Review Everything We Learned`;
export const instruction = (
  <>
    Fix <b>all</b> bugs in the code below
  </>
);
export const initialCode = `function HomePage() {
  return (
    <div
      id="container"
      style={{
        width: "100%",
        height: "100%",
        display: flex,
        flexdirection: "column",
        alignitems: "center"
      }}
    >
      <p
        style={{
          color: "#FF00FF",
          fontfamily: "sans-serif",
          fontweight: "bold",
          fontsize: "2rem"
        }}
      >
        Welcome to My Website!
      </p>
      <button
        style={{
          margintop: "3rem",
          padding: "1rem",
          color: "white",
          background: blue,
          border: "none",
          fontSize: 2rem,
          cursor: "pointer"
        }}
        onClick={() => alert("Hello World")}
      >
        Tap me
      </button>
    <div>
  );
}`;

export async function onRunCode({ ast, onSetErrorMsg, onUpdateMissionStatus }) {
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  let containerFlexDirection = '';
  let containerAlignItems = '';
  const containerDiv = jsxElements[0];
  const containerDivOpening = containerDiv?.openingElement;
  console.log(containerDivOpening, CONTAINER_FLEX_DIRECTION);
  if (containerFlexDirection === 'column' && containerAlignItems === 'center') {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(containerFlexDirection)) {
    return onSetErrorMsg(`Please set flex-direction of the container element`);
  }
  if (stringIsEmpty(containerAlignItems)) {
    return onSetErrorMsg(
      `Please align the items inside the container element to ${CONTAINER_ALIGN_ITEMS}`
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
