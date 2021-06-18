import React from 'react';
import {
  getAstProps,
  getElementAttribute,
  filterElementsByType
} from '../../helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const CONTAINER_FLEX_DIRECTION = 'column';
const CONTAINER_ALIGN_ITEMS = 'center';
const PARAGRAPH_FONT_FAMILY = 'sans-serif';
const PARAGRAPH_FONT_WEIGHT = 'bold';
const PARAGRAPH_FONT_SIZE = '2rem';
const BUTTON_MARGIN_TOP = '3rem';

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
  let paragraphFontFamily = '';
  let paragraphFontWeight = '';
  let paragraphFontSize = '';
  let buttonMarginTop = '';
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
  const paragraphs = filterElementsByType({
    elements: jsxElements,
    filter: 'p'
  });
  const paragraph = paragraphs[0];
  const paragraphStyle = getElementAttribute({
    openingElement: paragraph.openingElement,
    attributeName: 'style'
  });
  const paragraphStyleProps = paragraphStyle?.value?.expression?.properties;
  for (let prop of paragraphStyleProps) {
    if (prop?.key?.name === 'fontFamily') {
      paragraphFontFamily = prop?.value?.value;
    }
    if (prop?.key?.name === 'fontSize') {
      paragraphFontSize = prop?.value?.value;
    }
    if (prop?.key?.name === 'fontWeight') {
      paragraphFontWeight = prop?.value?.value;
    }
  }

  const buttons = filterElementsByType({
    elements: jsxElements,
    filter: 'button'
  });
  const button = buttons[0];
  const buttonStyle = getElementAttribute({
    openingElement: button.openingElement,
    attributeName: 'style'
  });
  const buttonStyleProps = buttonStyle?.value?.expression?.properties;
  for (let prop of buttonStyleProps) {
    if (prop?.key?.name === 'marginTop') {
      buttonMarginTop = prop?.value?.value;
    }
  }

  if (
    containerFlexDirection === CONTAINER_FLEX_DIRECTION &&
    containerAlignItems === CONTAINER_ALIGN_ITEMS &&
    paragraphFontFamily === PARAGRAPH_FONT_FAMILY &&
    paragraphFontSize === PARAGRAPH_FONT_SIZE &&
    paragraphFontWeight === PARAGRAPH_FONT_WEIGHT &&
    buttonMarginTop === BUTTON_MARGIN_TOP
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
  if (stringIsEmpty(paragraphFontFamily)) {
    return onSetErrorMsg(
      <>
        Please set the welcome {`message's`} <b>fontFamily</b> value to{' '}
        {`"${PARAGRAPH_FONT_FAMILY}"`}
      </>
    );
  }
  if (paragraphFontFamily !== PARAGRAPH_FONT_FAMILY) {
    return onSetErrorMsg(
      <>
        The <b>fontFamily</b> of the welcome message should be{' '}
        {`"${PARAGRAPH_FONT_FAMILY}"`}, not {`"${paragraphFontFamily}"`}
      </>
    );
  }
  if (stringIsEmpty(paragraphFontSize)) {
    return onSetErrorMsg(
      <>
        Please set the welcome {`message's`} <b>fontSize</b> value to{' '}
        {`"${PARAGRAPH_FONT_SIZE}"`}
      </>
    );
  }
  if (paragraphFontSize !== PARAGRAPH_FONT_SIZE) {
    return onSetErrorMsg(
      <>
        The <b>fontSize</b> of the welcome message should be{' '}
        {`"${PARAGRAPH_FONT_SIZE}"`}, not {`"${paragraphFontSize}"`}
      </>
    );
  }
  if (stringIsEmpty(paragraphFontWeight)) {
    return onSetErrorMsg(
      <>
        Please set the welcome {`message's`} <b>fontWeight</b> value to{' '}
        {`"${PARAGRAPH_FONT_WEIGHT}"`}
      </>
    );
  }
  if (paragraphFontWeight !== PARAGRAPH_FONT_WEIGHT) {
    return onSetErrorMsg(
      <>
        The <b>fontWeight</b> of the welcome message should be{' '}
        {`"${PARAGRAPH_FONT_WEIGHT}"`}, not {`"${paragraphFontWeight}"`}
      </>
    );
  }
  if (stringIsEmpty(buttonMarginTop)) {
    return onSetErrorMsg(
      <>
        Please set the {`button's`} <b>marginTop</b> value to{' '}
        {`"${BUTTON_MARGIN_TOP}"`}
      </>
    );
  }
  if (buttonMarginTop !== BUTTON_MARGIN_TOP) {
    return onSetErrorMsg(
      <>
        The <b>marginTop</b> of the button should be {`"${BUTTON_MARGIN_TOP}"`},
        not {`"${buttonMarginTop}"`}
      </>
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
