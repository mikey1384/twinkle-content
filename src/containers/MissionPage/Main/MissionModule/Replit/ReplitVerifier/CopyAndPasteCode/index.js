import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CopyCode from './CopyCode';
import PasteCode from './PasteCode';
import Button from 'components/Button';
import StepSlide from '../../../components/StepSlide';
import { isMobile } from 'helpers';
import { css } from '@emotion/css';

CopyAndPasteCode.propTypes = {
  index: PropTypes.number,
  onCorrectCodeEntered: PropTypes.func.isRequired
};

const deviceIsMobile = isMobile(navigator);
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

export default function CopyAndPasteCode({ index, onCorrectCodeEntered }) {
  const [codeCopied, setCodeCopied] = useState(false);

  if (deviceIsMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '7rem',
          fontSize: '1.7rem',
          fontWeight: 'bold',
          alignItems: 'center',
          lineHeight: 2
        }}
      >
        <p>Sorry, you need to use a computer for this step</p>
        <p>Come back when you are using a computer</p>
      </div>
    );
  }

  return (
    <StepSlide index={index} title="Copy the following code.">
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
            <h1
              className={css`
                margin-top: 3.5rem;
                margin-bottom: 2rem;
              `}
            >
              Did you copy it?
            </h1>
            <Button
              skeuomorphic
              color="green"
              style={{ marginTop: '3rem' }}
              onClick={() => setCodeCopied(true)}
            >
              Yes
            </Button>
          </div>
        )}
        {codeCopied && (
          <PasteCode
            style={{ marginTop: '2rem' }}
            initialCode={initialCode}
            onCorrectCodeEntered={onCorrectCodeEntered}
          />
        )}
      </div>
    </StepSlide>
  );
}
