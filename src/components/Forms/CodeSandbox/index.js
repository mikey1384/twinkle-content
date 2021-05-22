import React, { useState } from 'react';
import Editor from './Editor';

// https://github.com/uiwjs/react-codemirror/blob/master/src/index.js
// https://krasimirtsonev.com/blog/article/build-your-own-interactive-javascript-playground
// https://securingsincity.github.io/react-ace/
// https://github.com/rohanchandra/react-terminal-component
// https://codemirror.net/
export default function CodeSandbox() {
  const [code] = useState(`function HomePage() {
  return <div>Welcome to Next.js!</div>
}
   
export default HomePage`);

  return (
    <Editor
      value={code}
      options={{
        mode: 'jsx'
      }}
    />
  );
}
