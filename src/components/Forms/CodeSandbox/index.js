import React, { useState } from 'react';
import Editor from './Editor';

// https://krasimirtsonev.com/blog/article/build-your-own-interactive-javascript-playground
export default function CodeSandbox() {
  const [code, setCode] = useState(`function HomePage() {
  return <div>Welcome to Next.js!</div>
}

export default HomePage`);

  return (
    <Editor
      value={code}
      options={{
        mode: 'jsx',
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true
      }}
      onChange={setCode}
    />
  );
}
