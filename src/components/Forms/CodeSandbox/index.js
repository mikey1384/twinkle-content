import React from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';

CodeSandbox.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired
};

export default function CodeSandbox({ code, onSetCode }) {
  return (
    <Editor
      value={code}
      options={{
        mode: 'jsx',
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lint: true
      }}
      onChange={onSetCode}
    />
  );
}
