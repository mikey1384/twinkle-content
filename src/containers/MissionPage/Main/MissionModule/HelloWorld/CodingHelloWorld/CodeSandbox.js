import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';

// https://github.com/uiwjs/react-codemirror/blob/master/src/index.js
// https://krasimirtsonev.com/blog/article/build-your-own-interactive-javascript-playground
// https://securingsincity.github.io/react-ace/
// https://github.com/rohanchandra/react-terminal-component
// https://codemirror.net/
export default function CodeSandbox() {
  const [code] = useState(`
  
  
  
  `);

  return (
    <CodeMirror
      value={code}
      options={{
        theme: 'monokai',
        tabSize: 2,
        keyMap: 'sublime',
        mode: 'jsx'
      }}
    />
  );
}
