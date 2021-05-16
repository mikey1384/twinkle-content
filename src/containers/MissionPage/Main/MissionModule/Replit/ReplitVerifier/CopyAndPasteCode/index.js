import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CopyCode from './CopyCode';
import PasteCode from './PasteCode';
import Button from 'components/Button';
import { css } from '@emotion/css';

CopyAndPasteCode.propTypes = {
  style: PropTypes.object
};

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

export default function CopyAndPasteCode({ style }) {
  const [codeCopied, setCodeCopied] = useState(false);
  return (
    <div
      style={style}
      className={css`
        width: 100%;
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
          font-size: 2rem;
          font-weight: bold;
        }
      `}
    >
      <p>3. Fan-tastic! Now, copy the following code</p>
      <CopyCode codeToCopy={codeToCopy} style={{ marginTop: '1.5rem' }} />
      <div style={{ marginTop: '2.5rem', width: '100%' }}>
        {!codeCopied && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <p>Did you copy it?</p>
            <Button
              filled
              color="green"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setCodeCopied(true)}
            >
              Yes
            </Button>
          </div>
        )}
        {codeCopied && <PasteCode initialCode={initialCode} />}
      </div>
    </div>
  );
}
