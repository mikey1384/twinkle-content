import React from 'react';
import Button from 'components/Button';
import { css } from '@emotion/css';

export default function MakeAccount() {
  return (
    <div
      className={css`
        width: 100%;
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        > p {
          font-size: 2rem;
          font-weight: bold;
        }
      `}
    >
      <p>
        1. Make a new Replit account at{' '}
        <a href="https://replit.com" target="_blank" rel="noreferrer">
          https://replit.com
        </a>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          style={{ marginTop: '2.5rem' }}
          filled
          color="logoBlue"
          onClick={() => console.log('clicked')}
        >
          I made an account
        </Button>
      </div>
    </div>
  );
}
