import React from 'react';
import {
  getAstProps,
  getElementStyleProps,
  filterElementsByType,
  returnStyleErrorMsg
} from '../../helpers';

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
  const containerStyleProps = getElementStyleProps(containerDivOpening);
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
  const paragraphStyleProps = getElementStyleProps(paragraph.openingElement);
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
  const buttonStyleProps = getElementStyleProps(button.openingElement);
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
  if (containerFlexDirection !== CONTAINER_FLEX_DIRECTION) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: 'container',
        propName: 'flexDirection',
        correctValue: CONTAINER_FLEX_DIRECTION,
        valueEntered: containerFlexDirection
      })
    );
  }
  if (containerAlignItems !== CONTAINER_ALIGN_ITEMS) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: 'container',
        propName: 'alignItems',
        correctValue: CONTAINER_ALIGN_ITEMS,
        valueEntered: containerAlignItems
      })
    );
  }
  if (paragraphFontFamily !== PARAGRAPH_FONT_FAMILY) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: 'welcome message',
        propName: 'fontFamily',
        correctValue: PARAGRAPH_FONT_FAMILY,
        valueEntered: paragraphFontFamily
      })
    );
  }
  if (paragraphFontSize !== PARAGRAPH_FONT_SIZE) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: 'welcome message',
        propName: 'fontSize',
        correctValue: PARAGRAPH_FONT_SIZE,
        valueEntered: paragraphFontSize
      })
    );
  }
  if (paragraphFontWeight !== PARAGRAPH_FONT_WEIGHT) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: 'welcome message',
        propName: 'fontWeight',
        correctValue: PARAGRAPH_FONT_WEIGHT,
        valueEntered: paragraphFontWeight
      })
    );
  }
  if (buttonMarginTop !== BUTTON_MARGIN_TOP) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        elementName: 'button',
        propName: 'marginTop',
        correctValue: BUTTON_MARGIN_TOP,
        valueEntered: buttonMarginTop
      })
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
