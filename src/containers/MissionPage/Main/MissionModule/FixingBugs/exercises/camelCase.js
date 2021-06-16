import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const MARGIN_TOP = '3rem';

export const title = `Is it camelCased?`;
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
      <div>First</div>
      <div style={{ marginTop: "1rem" }}>Second</div>
    </div>
  );
}`;

export async function onRunCode({ ast, onSetErrorMsg, onUpdateMissionStatus }) {
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXElement'
  });
  let marginTop = '';
  for (let element of jsxElements) {
    if (
      element.openingElement?.attributes?.length > 0 &&
      element.openingElement?.name?.name === 'div' &&
      element?.children
    ) {
      for (let child of element?.children) {
        if (child?.value === 'Third') {
          for (let attribute of element.openingElement?.attributes) {
            if (attribute?.name?.name === 'style') {
              const styleProps = attribute?.value?.expression?.properties;
              for (let prop of styleProps) {
                if (prop?.key?.name === 'marginTop') {
                  marginTop = prop?.value?.value;
                }
              }
            }
          }
        }
      }
    }
  }
  if (marginTop === MARGIN_TOP) {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(marginTop)) {
    return onSetErrorMsg(
      `Please set the top margin of the third element to "${MARGIN_TOP}"`
    );
  }
  if (marginTop !== MARGIN_TOP) {
    return onSetErrorMsg(
      `The third element's top margin must be "${MARGIN_TOP}," not "${marginTop}"`
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
