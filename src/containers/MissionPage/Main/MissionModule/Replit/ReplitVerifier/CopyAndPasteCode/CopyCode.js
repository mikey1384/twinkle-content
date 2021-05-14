import React from 'react';
import PropTypes from 'prop-types';
import Code from 'components/Code';
import { css } from '@emotion/css';
import { mobileMaxWidth, borderRadius } from 'constants/css';

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

CopyCode.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

export default function CopyCode({ className, style }) {
  return (
    <div className={className} style={style}>
      <Code
        language="jsx"
        theme="dracula"
        className={css`
          border-radius: ${borderRadius};
          padding: 1.5rem;
          font-size: 1.2rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.1rem;
          }
        `}
      >
        {codeToCopy}
      </Code>
    </div>
  );
}
