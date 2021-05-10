import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Code from 'components/Code';
import { mobileMaxWidth, borderRadius } from 'constants/css';
import { css } from '@emotion/css';
import Button from 'components/Button';

const initialCode = `${Math.random().toString(36).substr(2, 6)}`;
const codeToCopy = `import { useEffect, useState } from 'react';

function HomePage() {
  const [code, setCode] = useState('');
  const initialCode = '${initialCode}';
  useEffect(() => {
    let result = '';
    for (let i = 0; i < initialCode.length; i++) {
      const number = initialCode.charCodeAt(i) % 10;
      result += number;
    }
    setCode(result);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          height: 'CALC(100vh - 1rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}
      >
        {code}
      </div>
    </div>
  )
}

export default HomePage;`;

export default function Replit() {
  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <Button onClick={() => console.log(initialCode)}>click me</Button>
      <Code
        language="jsx"
        theme="dracula"
        className={css`
          border-radius: ${borderRadius};
          padding: 1.5rem;
          font-size: 1.5rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.3rem;
          }
        `}
      >
        {codeToCopy}
      </Code>
    </ErrorBoundary>
  );
}
