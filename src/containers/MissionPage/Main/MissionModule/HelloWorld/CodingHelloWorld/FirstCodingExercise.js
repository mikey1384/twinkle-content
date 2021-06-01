import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function FirstCodingExercise({ code, onSetCode, style }) {
  const [errorMsg, setErrorMsg] = useState('');
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
        onSetErrorMsg={setErrorMsg}
        hasError={errorMsg}
        runButtonLabel="check"
      />
      {errorMsg && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: `1px solid ${Color.cranberry()}`,
            borderRadius,
            textAlign: 'center',
            color: '#fff',
            background: Color.cranberry(0.6)
          }}
        >
          {errorMsg}
        </div>
      )}
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
    if (
      buttonColor === 'blue' ||
      buttonColor.toLowerCase() === '#0000ff' ||
      buttonColor === 'rgb(0, 0, 255)'
    ) {
      return console.log('success');
    }
    if (!buttonColor) {
      return setErrorMsg(
        <b>
          Please change the color of the button to{' '}
          <span style={{ color: 'blue' }}>blue</span>
        </b>
      );
    }
    setErrorMsg(
      <b>
        The {`button's`} color needs to be{' '}
        <span style={{ color: 'blue' }}>blue,</span> not {buttonColor}
      </b>
    );
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
