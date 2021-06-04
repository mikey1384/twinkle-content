import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/ErrorBoundary';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function FirstCodingExercise({
  code,
  onSetCode,
  passed,
  style
}) {
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
    <ErrorBoundary>
      <p>
        1. Make it blue
        {passed && (
          <Icon
            style={{ marginLeft: '1rem' }}
            icon="check"
            color={Color.green()}
          />
        )}
      </p>
      <div
        className={css`
          width: 80%;
          font-size: 1.7rem;
          line-height: 2;
          text-align: center;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        style={{ marginTop: '2rem' }}
      >
        Change the color of the <b style={{ color: 'red' }}>red</b> button below
        to <b style={{ color: 'blue' }}>blue</b> and tap the{' '}
        <b style={{ color: Color.green() }}>check</b> button
      </div>
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
          hasError={!!errorMsg}
          passed={passed}
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
    </ErrorBoundary>
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
