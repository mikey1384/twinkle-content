import {
  getAstProps,
  filterElementsByType,
  getElementStyleProps,
  returnStyleErrorMsg
} from '../../helpers';

const FONT_SIZE = '30px';

export const title = `Is It CamelCased?`;
export const instruction = `Can you fix the bug in the code below?`;
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        textAlign: "center"
      }}
    >
      <div style={{ color: "blue", fontSize: "${FONT_SIZE}" }}>
        My font size is ${FONT_SIZE}
      </div>
      <div style={{ color: "orange", fontsize: "${FONT_SIZE}" }}>
        My font size should be ${FONT_SIZE}, too!
      </div>
    </div>
  );
}`;

export async function onRunCode({ ast, onSetErrorMsg, onUpdateMissionStatus }) {
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  let fontSize = '';
  const dividers = filterElementsByType({
    elements: jsxElements,
    filter: 'div'
  });
  let secondChild = null;
  const JSXChildren = dividers[0]?.children?.filter(
    (child) => child.type === 'JSXElement'
  );
  secondChild = JSXChildren?.[1];
  if (secondChild && secondChild.openingElement) {
    const styleProps = getElementStyleProps(secondChild.openingElement);
    for (let prop of styleProps) {
      if (prop?.key?.name === 'fontSize') {
        fontSize = prop?.value?.value;
      }
    }
  }
  if (fontSize === FONT_SIZE) {
    return await onUpdateMissionStatus();
  }
  if (!secondChild) {
    return onSetErrorMsg(`Don't delete any <div>s`);
  }
  if (!fontSize) {
    return onSetErrorMsg(
      `The font size property for the second sentence still isn't working`
    );
  }
  if (fontSize !== FONT_SIZE) {
    return onSetErrorMsg(
      returnStyleErrorMsg({
        targetName: 'second <div>',
        propName: 'fontSize',
        correctValue: FONT_SIZE,
        valueEntered: fontSize
      })
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
