import React, { useRef } from 'react';
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
  const simulatorRef = useRef(null);
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
        simulatorRef={simulatorRef}
        runButtonLabel="check"
      />
    </div>
  );

  function handleRunCode(ast) {
    const results = [];
    for (let key in ast) {
      analyseAstProp(ast[key]);
    }

    function analyseAstProp(astProp) {
      if (typeof astProp === 'object') {
        if (astProp?.type) {
          console.log(astProp);
        }
        if (astProp?.type === 'ArrowFunctionExpression') {
          results.push(astProp);
        }
        for (let key in astProp) {
          analyseAstProp(astProp[key]);
        }
      }
    }
    console.log(results);
  }
}
