import React from 'react';
import {
  getAstProps,
  filterElementsByType,
  getElementStyleProps,
  returnStyleErrorMsg
} from '../../helpers';
import { Color } from 'constants/css';

const FLEX_DIRECTION = 'column';
const ALIGN_ITEMS = 'center';
const BUTTON_MARGIN_TOP = '2rem';

export const title = `Change the Direction`;
export const instruction = (
  <>
    <div>
      Set the <b>{`<div>`}</b>
      {`'s`} <b>flexDirection</b> value to <b>{`"${FLEX_DIRECTION}"`}</b>
    </div>
    <div>
      and its <b>alignItems</b> value to <b>{`"${ALIGN_ITEMS}"`}</b>
    </div>
    <div style={{ marginTop: '2rem' }}>
      Set the <b style={{ color: 'orange' }}>second button</b>
      {`'s`} <b>marginTop</b> value to <b>{`"${BUTTON_MARGIN_TOP}"`}</b>
    </div>
    <div style={{ marginTop: '2rem' }}>
      Tap the <b style={{ color: Color.logoBlue() }}>format</b> button to make
      our code look nice and clean
    </div>
  </>
);
export const initialCode = `function HomePage() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
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
          color: "white"
        }}
        onClick={() => {
          let name = prompt("What's your name?");
          if (name) {
            alert(${'"Nice to meet you, "' + ' + ' + 'name' + ' + ' + '"!"'});
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

export async function onRunCode({ ast, onUpdateMissionStatus, onSetErrorMsg }) {
  let divFlexDirection = '';
  let divAlignItems = '';
  let buttonMarginTop = '';
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  const divElements = filterElementsByType({
    elements: jsxElements,
    filter: 'div'
  });
  const divElement = divElements[0];
  const buttonElements = filterElementsByType({
    elements: jsxElements,
    filter: 'button'
  });
  const buttonElement = buttonElements[1];
  if (divElement) {
    const styleProps = getElementStyleProps(divElement.openingElement);
    for (let prop of styleProps) {
      const propName = prop?.key?.name;
      const propValue = prop?.value?.value;
      if (propName === 'flexDirection') {
        divFlexDirection = propValue;
      }
      if (propName === 'alignItems') {
        divAlignItems = propValue;
      }
    }
  }
  if (buttonElement) {
    const styleProps = getElementStyleProps(buttonElement.openingElement);
    for (let prop of styleProps) {
      const propName = prop?.key?.name;
      const propValue = prop?.value?.value;
      if (propName === 'marginTop') {
        buttonMarginTop = propValue;
      }
    }
  }
  if (
    divFlexDirection === FLEX_DIRECTION &&
    divAlignItems === ALIGN_ITEMS &&
    buttonMarginTop === BUTTON_MARGIN_TOP
  ) {
    return await onUpdateMissionStatus();
  }
  if (!divElement) {
    return onSetErrorMsg(
      <>
        {`Where's`} the <b>{`<div></div>`}</b> pair?
      </>
    );
  }
  if (divFlexDirection !== FLEX_DIRECTION) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: '<div>',
        propName: 'flexDirection',
        correctValue: FLEX_DIRECTION,
        valueEntered: divFlexDirection
      })
    );
  }
  if (divAlignItems !== ALIGN_ITEMS) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: '<div>',
        propName: 'alignItems',
        correctValue: ALIGN_ITEMS,
        valueEntered: divAlignItems
      })
    );
  }
  if (!buttonElement) {
    return onSetErrorMsg(`Did you delete the second button?`);
  }
  if (buttonMarginTop !== BUTTON_MARGIN_TOP) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'second button',
        propName: 'marginTop',
        correctValue: BUTTON_MARGIN_TOP,
        valueEntered: buttonMarginTop
      })
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
