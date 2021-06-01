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
    const results = fetchAstProps({ ast, propType: 'JSXOpeningElement' });
    console.log(results);
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
