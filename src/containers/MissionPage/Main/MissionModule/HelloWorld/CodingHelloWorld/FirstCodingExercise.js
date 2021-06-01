import React from 'react';
import PropTypes from 'prop-types';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function FirstCodingExercise({ code, onSetCode, style }) {
  const initialCode = `function HomePage() {
  return (
    <div>
      <button
        style={{
          color: "white",
          background: "red",
          border: "none",
          fontSize: "2rem",
          padding: "1rem",
          cursor: "pointer"
        }}
        onClick={() => alert('I am a button')}
      >
        Change me
      </button>
    </div>
  );
}`;

  return (
    <div
      style={style}
      className={css`
        width: 80%;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <CodeSandbox
        code={code || initialCode}
        onSetCode={onSetCode}
        onRunCode={handleRunCode}
        runButtonLabel="check"
      />
    </div>
  );

  function handleRunCode(ast) {
    const jsxElements = fetchAstProps({ ast, propType: 'JSXOpeningElement' });
    let buttonColor = '';
    for (let element of jsxElements) {
      if (element.attributes?.length > 0 && element?.name?.name === 'button') {
        for (let attribute of element.attributes) {
          if (attribute?.name?.name === 'style') {
            const styleProps = attribute?.value?.expression?.properties;
            for (let prop of styleProps) {
              if (
                prop?.key?.name === 'background' ||
                prop?.key?.name === 'backgroundColor'
              ) {
                buttonColor = prop?.value?.value;
                break;
              }
            }
          }
        }
      }
    }
    console.log(buttonColor);
  }

  function fetchAstProps({ ast, propType }) {
    const results = [];
    for (let key in ast) {
      _fetchAstProps({ astProp: ast[key], propType });
    }

    function _fetchAstProps({ astProp, propType }) {
      if (astProp && typeof astProp === 'object') {
        if (
          (!propType && astProp?.type) ||
          (!!propType && astProp?.type === propType)
        ) {
          results.push(astProp);
        }
        for (let key in astProp) {
          _fetchAstProps({ astProp: astProp[key], propType });
        }
      }
    }
    return results;
  }
}
