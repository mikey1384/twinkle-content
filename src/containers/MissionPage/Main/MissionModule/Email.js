import React, { useState } from 'react';
import Input from 'components/Texts/Input';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

export default function Email() {
  const [email, setEmail] = useState('');
  return (
    <div style={{ width: '100%' }}>
      <p
        className={css`
          width: 100%;
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
        `}
      >
        Enter your email address below and tap submit
      </p>
      <div
        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
      >
        <Input
          className={css`
            width: 50%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          type="email"
          maxLength={100}
          placeholder="somebody@something.com"
          onChange={setEmail}
          value={email}
        />
      </div>
    </div>
  );
}
