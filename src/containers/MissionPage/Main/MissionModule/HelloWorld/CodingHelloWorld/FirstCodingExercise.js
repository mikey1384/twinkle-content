import React from 'react';
import PropTypes from 'prop-types';
import CodeSandbox from 'components/Forms/CodeSandbox';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired
};

export default function FirstCodingExercise({ code, onSetCode }) {
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
      className={css`
        width: 70%;
        margin-top: 1rem;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
          margin-top: 1.5rem;
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
