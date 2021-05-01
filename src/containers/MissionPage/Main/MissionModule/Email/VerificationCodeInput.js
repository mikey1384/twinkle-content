import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Input from 'components/Texts/Input';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

export default function VerificationCodeInput() {
  const [verificationCode, setVerificationCode] = useState('');
  return (
    <ErrorBoundary
      style={{
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <Input
        className={css`
          width: 50%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        type="text"
        maxLength={6}
        placeholder="Enter the 6-digit number"
        onChange={setVerificationCode}
        value={verificationCode}
      />
    </ErrorBoundary>
  );
}
