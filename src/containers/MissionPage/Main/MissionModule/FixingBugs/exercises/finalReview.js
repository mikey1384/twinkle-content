import React from 'react';
import { getAstProps, getElementAttribute } from '../../helpers';
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
  const containerStyle = getElementAttribute({
    openingElement: containerDivOpening,
    attributeName: 'style'
  });
  const containerStyleProps = containerStyle?.value?.expression?.properties;
  for (let prop of containerStyleProps) {
    if (prop?.key?.name === 'flexDirection') {
      containerFlexDirection = prop?.value?.value;
    }
    if (prop?.key?.name === 'alignItems') {
      containerAlignItems = prop?.value?.value;
    }
  }
  if (
    containerFlexDirection === CONTAINER_FLEX_DIRECTION &&
    containerAlignItems === CONTAINER_ALIGN_ITEMS
  ) {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(containerFlexDirection)) {
    return onSetErrorMsg(
      <>
        Please set <b>flexDirection</b> of the container element
      </>
    );
  }
  if (containerFlexDirection !== CONTAINER_FLEX_DIRECTION) {
    return onSetErrorMsg(
      <>
        The <b>flexDirection</b> of the container should be{' '}
        {`"${CONTAINER_FLEX_DIRECTION}"`}, not {`"${containerFlexDirection}"`}
      </>
    );
  }
  if (stringIsEmpty(containerAlignItems)) {
    return onSetErrorMsg(
      <>
        Please set the container {`element's`} <b>alignItems</b> value to{' '}
        {`"${CONTAINER_ALIGN_ITEMS}"`}
      </>
    );
  }
  if (containerAlignItems !== CONTAINER_ALIGN_ITEMS) {
    return onSetErrorMsg(
      <>
        The container {`element's`} <b>alignItems</b> value should be set to{' '}
        {`"${CONTAINER_FLEX_DIRECTION}"`}, not {`"${containerAlignItems}"`}
      </>
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
