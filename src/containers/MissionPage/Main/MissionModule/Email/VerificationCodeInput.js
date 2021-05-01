import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Input from 'components/Texts/Input';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

VerificationCodeInput.propTypes = {
  onRetry: PropTypes.func.isRequired
};

export default function VerificationCodeInput({ onRetry }) {
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
      <p
        onClick={onRetry}
        style={{
          marginTop: '0.5rem',
          cursor: 'pointer',
          color: Color.blue()
        }}
        className={css`
          font-size: 1.3rem;
          &:hover {
            text-decoration: underline;
          }
        `}
      >{`Didn't receive an email? Tap here to retry`}</p>
    </ErrorBoundary>
  );
}
