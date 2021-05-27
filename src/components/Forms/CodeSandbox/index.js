import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import { formatCode } from './code-generator';

CodeSandbox.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  onRunCode: PropTypes.func
};

export default function CodeSandbox({
  code: globalCode,
  onSetCode,
  onRunCode
}) {
  const timerRef = useRef(null);
  const [code, setCode] = useState(globalCode);
  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Editor
        value={globalCode}
        valueOnTextEditor={code}
        onChange={handleSetCode}
      />
      <div
        style={{
          marginTop: '1rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <Button filled color="logoBlue" onClick={handleFormatCode}>
            Format
          </Button>
        </div>
        <div>
          {onRunCode && (
            <Button filled color="green" onClick={onRunCode}>
              Run
            </Button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  function handleFormatCode() {
    onSetCode(formatCode(globalCode));
    setCode(formatCode(code));
  }

  function handleSetCode(text) {
    clearTimeout(timerRef.current);
    setCode(text);
    timerRef.current = setTimeout(() => onSetCode(text), 1000);
  }
}
