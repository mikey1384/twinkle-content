import { getAstProps } from '../../helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

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
  for (let element of jsxElements) {
    if (
      element.openingElement?.attributes?.length > 0 &&
      element.openingElement?.name?.name === 'div' &&
      element?.children
    ) {
      const JSXChildren = element.children.filter(
        (child) => child.type === 'JSXElement'
      );
      if (JSXChildren?.[1] && JSXChildren?.[1]?.openingElement) {
        for (let attribute of JSXChildren?.[1]?.openingElement?.attributes) {
          if (attribute?.name?.name === 'style') {
            const styleProps = attribute?.value?.expression?.properties;
            for (let prop of styleProps) {
              if (prop?.key?.name === 'fontSize') {
                fontSize = prop?.value?.value;
              }
            }
          }
        }
      }
    }
  }
  if (fontSize === FONT_SIZE) {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(fontSize)) {
    return onSetErrorMsg(
      `The font size property for the second sentence still isn't working`
    );
  }
  if (fontSize !== FONT_SIZE) {
    return onSetErrorMsg(`The font size must be ${FONT_SIZE}, not ${fontSize}`);
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
