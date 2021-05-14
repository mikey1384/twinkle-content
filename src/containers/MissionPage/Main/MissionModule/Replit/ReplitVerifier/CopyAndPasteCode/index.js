import React from 'react';
import PropTypes from 'prop-types';
import CopyCode from './CopyCode';
import Button from 'components/Button';
import { css } from '@emotion/css';

CopyAndPasteCode.propTypes = {
  style: PropTypes.object
};

export default function CopyAndPasteCode({ style }) {
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
      <p>3. Fan-tastic! Now, copy the code below</p>
      <CopyCode style={{ marginTop: '1.5rem' }} />
      <div
        style={{
          marginTop: '2rem',
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
          onClick={() => console.log('clicked')}
        >
          Yes
        </Button>
      </div>
    </div>
  );
}
