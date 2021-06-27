import {
  getAstProps,
  filterElementsByType,
  getElementStyleProps,
  returnStyleErrorMsg
} from '../../helpers';

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
  const dividers = filterElementsByType({
    elements: jsxElements,
    filter: 'div'
  });
  for (let divider of dividers) {
    const JSXChildren = divider.children.filter(
      (child) => child.type === 'JSXElement'
    );
    const secondChild = JSXChildren?.[1];
    if (secondChild) {
      const secondChildStyleProps = getElementStyleProps(
        secondChild.openingElement
      );
      for (let prop of secondChildStyleProps) {
        if (prop?.key?.name === 'marginTop') {
          secondMarginTop = prop?.value?.value;
        }
      }
    }
    const thirdChild = JSXChildren?.[2];
    if (thirdChild) {
      const thirdChildStyleProps = getElementStyleProps(
        thirdChild.openingElement
      );
      for (let prop of thirdChildStyleProps) {
        if (prop?.key?.name === 'marginTop') {
          thirdMarginTop = prop?.value?.value;
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
  if (secondMarginTop !== SECOND_MARGIN_TOP) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'second <div>',
        propName: 'marginTop',
        correctValue: SECOND_MARGIN_TOP,
        valueEntered: secondMarginTop
      })
    );
  }
  if (thirdMarginTop !== THIRD_MARGIN_TOP) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'third <div>',
        propName: 'marginTop',
        correctValue: THIRD_MARGIN_TOP,
        valueEntered: thirdMarginTop
      })
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
