import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Code from 'components/Code';
import { mobileMaxWidth, borderRadius } from 'constants/css';
import { css } from '@emotion/css';

const codeToCopy = `import { useEffect, useState } from 'react';

function HomePage() {
  const [code, setCode] = useState('');
  useEffect(() => {
    const name = 'mikey';
    let result = '';
    for (let i = 0; i < name.length; i++) {
      const number = name.charCodeAt(i) % 10;
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
