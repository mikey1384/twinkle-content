import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const SECOND_MARGIN_TOP = '2rem';
const THIRD_MARGIN_TOP = '2rem';

export const title = `All Tags Must Be Closed`;
export const instruction = `Can you fix the bug in the code below?`;
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontSize: "2rem",
        textAlign: "center"
      }}
    >
      <div>All Tags</div>
      <div style={{ marginTop: "${SECOND_MARGIN_TOP}" }}>Must</div>
      <div style={{ marginTop: "${THIRD_MARGIN_TOP}" }}>Be Closed</div>
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
