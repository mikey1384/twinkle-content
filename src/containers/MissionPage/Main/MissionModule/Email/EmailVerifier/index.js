import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import EmailSubmitForm from './EmailSubmitForm';
import VerificationCodeInput from './VerificationCodeInput';

export default function EmailVerifier() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  return (
    <ErrorBoundary>
      <p
        className={css`
          width: 100%;
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.5rem;
          }
        `}
      >
        {emailSent ? (
          'Enter the 6-digit number sent to your email'
        ) : (
          <>
            Enter your email address below and tap{' '}
            <b style={{ color: Color.green() }}>submit</b>
          </>
        )}
      </p>
      {!emailSent && (
        <EmailSubmitForm
          email={email}
          onSetEmail={setEmail}
          onSetEmailSent={setEmailSent}
        />
      )}
      {emailSent && (
        <VerificationCodeInput
          email={email}
          onRetry={() => setEmailSent(false)}
        />
      )}
    </ErrorBoundary>
  );
}
