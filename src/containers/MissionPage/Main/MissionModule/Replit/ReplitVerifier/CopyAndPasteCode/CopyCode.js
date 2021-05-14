import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Code from 'components/Code';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth, borderRadius } from 'constants/css';

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
  const [copiedShown, setCopiedShown] = useState(false);
  const codeRef = useRef(null);
  return (
    <div className={className} style={style}>
      <Code
        codeRef={codeRef}
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
      <div
        className={css`
          margin-left: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            margin-left: 0;
          }
        `}
        style={{ position: 'relative' }}
      >
        <Button
          transparent
          onClick={() => {
            setCopiedShown(true);
            handleCopyToClipboard();
            setTimeout(() => setCopiedShown(false), 700);
          }}
        >
          <Icon icon="copy" />
        </Button>
        <div
          style={{
            zIndex: 300,
            display: copiedShown ? 'block' : 'none',
            marginTop: '0.2rem',
            position: 'absolute',
            background: '#fff',
            fontSize: '1.2rem',
            padding: '1rem',
            border: `1px solid ${Color.borderGray()}`
          }}
        >
          Copied!
        </div>
      </div>
    </div>
  );

  function handleCopyToClipboard() {
    const range = document.createRange();
    range.selectNode(codeRef.current);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
  }
}
