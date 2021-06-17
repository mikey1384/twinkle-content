import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const SECOND_MARGIN_TOP = '2rem';
const THIRD_MARGIN_TOP = '2rem';

export const title = `Final Review`;
export const instruction = `Fix all the bugs in the code below`;
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
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
  let secondMarginTop = '';
  let thirdMarginTop = '';
  for (let element of jsxElements) {
    if (
      element.openingElement?.attributes?.length > 0 &&
      element.openingElement?.name?.name === 'div' &&
      element?.children
    ) {
      const JSXChildren = element?.children?.filter(
        (child) => child.type === 'JSXElement'
      );
      if (JSXChildren[1] && JSXChildren?.[1]?.openingElement) {
        for (let attribute of JSXChildren?.[1]?.openingElement?.attributes) {
          if (attribute?.name?.name === 'style') {
            const styleProps = attribute?.value?.expression?.properties;
            for (let prop of styleProps) {
              if (prop?.key?.name === 'marginTop') {
                secondMarginTop = prop?.value?.value;
              }
            }
          }
        }
      }
      if (JSXChildren[2] && JSXChildren?.[2]?.openingElement) {
        for (let attribute of JSXChildren?.[2]?.openingElement?.attributes) {
          if (attribute?.name?.name === 'style') {
            const styleProps = attribute?.value?.expression?.properties;
            for (let prop of styleProps) {
              if (prop?.key?.name === 'marginTop') {
                thirdMarginTop = prop?.value?.value;
              }
            }
          }
        }
      }
    }
  }
  if (
    secondMarginTop === SECOND_MARGIN_TOP &&
    thirdMarginTop === THIRD_MARGIN_TOP
  ) {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(secondMarginTop)) {
    return onSetErrorMsg(
      `Please set the top margin of the second element to "${SECOND_MARGIN_TOP}"`
    );
  }
  if (stringIsEmpty(thirdMarginTop)) {
    return onSetErrorMsg(
      `Please set the top margin of the third element to "${THIRD_MARGIN_TOP}"`
    );
  }
  if (secondMarginTop !== SECOND_MARGIN_TOP) {
    return onSetErrorMsg(
      `The second element's top margin must be "${SECOND_MARGIN_TOP}," not "${secondMarginTop}"`
    );
  }
  if (thirdMarginTop !== THIRD_MARGIN_TOP) {
    return onSetErrorMsg(
      `The third element's top margin must be "${THIRD_MARGIN_TOP}," not "${thirdMarginTop}"`
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
