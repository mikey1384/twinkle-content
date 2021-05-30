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
      <CodeSandbox code={code || initialCode} onSetCode={onSetCode} />
    </div>
  );
}
