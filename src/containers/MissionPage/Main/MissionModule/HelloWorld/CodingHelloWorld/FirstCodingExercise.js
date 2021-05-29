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
    <div
      style={{
        color: "blue",
        border: "1px solid blue",
        fontSize: "2rem",
        padding: "1rem"
      }}
    >
      Change me
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
      />
    </div>
  );

  async function handleRunCode() {
    console.log('ok');
  }
}
