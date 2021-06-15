import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const PADDING = '3rem';
const MARGIN_TOP = '7rem';

export const title = `Remember the Quotation Marks`;
export const instruction = `There's a bug in the code below. Fix it!`;
export const initialCode = `function HomePage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <div>First</div>
      <div style={{ marginTop: "2rem" }}>Second</div>
      <div style={{ marginTop: 3rem }}>Third</div>
    </div>
  );
}`;

export async function onRunCode({ ast, onSetErrorMsg, onUpdateMissionStatus }) {
  const jsxElements = getAstProps({
    ast,
    propType: 'JSXOpeningElement'
  });
  let marginTop = '';
  let padding = '';
  for (let element of jsxElements) {
    if (element.attributes?.length > 0 && element?.name?.name === 'button') {
      for (let attribute of element.attributes) {
        if (attribute?.name?.name === 'style') {
          const styleProps = attribute?.value?.expression?.properties;
          for (let prop of styleProps) {
            if (prop?.key?.name === 'marginTop') {
              marginTop = prop?.value?.value;
            }
            if (prop?.key?.name === 'padding') {
              padding = prop?.value?.value;
            }
          }
        }
      }
    }
  }
  if (marginTop === MARGIN_TOP && padding === PADDING) {
    return await onUpdateMissionStatus();
  }
  if (stringIsEmpty(marginTop)) {
    return onSetErrorMsg(
      `Please set the top margin of the button to "${MARGIN_TOP}"`
    );
  }
  if (stringIsEmpty(padding)) {
    return onSetErrorMsg(
      `Please set the padding of the button to "${PADDING}"`
    );
  }
  if (marginTop !== MARGIN_TOP) {
    return onSetErrorMsg(
      `The button's top margin must be "${MARGIN_TOP}," not "${marginTop}"`
    );
  }
  if (padding !== PADDING) {
    return onSetErrorMsg(
      `The button's padding must be "${PADDING}," not "${padding}"`
    );
  }
  onSetErrorMsg(`Something's not right - please check the code`);
}
