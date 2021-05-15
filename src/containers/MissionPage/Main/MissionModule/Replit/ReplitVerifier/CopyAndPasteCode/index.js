import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CopyCode from './CopyCode';
import PasteCode from './PasteCode';
import Button from 'components/Button';
import { css } from '@emotion/css';

CopyAndPasteCode.propTypes = {
  style: PropTypes.object
};

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
      <CopyCode style={{ marginTop: '1.5rem' }} />
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
        {codeCopied && <PasteCode />}
      </div>
    </div>
  );
}
