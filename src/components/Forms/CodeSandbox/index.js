import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';

CodeSandbox.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired
};

export default function CodeSandbox({ code: globalCode, onSetCode }) {
  const timerRef = useRef(null);
  const [code, setCode] = useState(globalCode);
  return (
    <div>
      <Editor
        value={globalCode}
        valueOnTextEditor={code}
        options={{
          mode: 'jsx',
          lineWrapping: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          lint: true
        }}
        onChange={handleSetCode}
      />
    </div>
  );

  function handleSetCode(text) {
    clearTimeout(timerRef.current);
    setCode(text);
    timerRef.current = setTimeout(() => onSetCode(text), 1000);
  }
}
