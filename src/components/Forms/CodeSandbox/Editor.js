import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'codemirror/mode/meta';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/lint/lint.css';
import './material-darker.css';
import Compiler from './Compiler';
import SimpleEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { transformBeforeCompilation } from './ast';

Editor.propTypes = {
  value: PropTypes.string,
  valueOnTextEditor: PropTypes.string,
  onChange: PropTypes.func
};
export default function Editor({ value = '', valueOnTextEditor, onChange }) {
  const [error, setError] = useState('');

  return (
    <div style={{ width: '100%' }}>
      <div>
        <Compiler
          code={value}
          transformations={[(ast) => transformBeforeCompilation(ast)]}
          minHeight={62}
          setError={(error) => setError(error)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SimpleEditor
        value={valueOnTextEditor}
        onValueChange={onChange}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12
        }}
      />
    </div>
  );
}
