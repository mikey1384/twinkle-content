import React, { useState } from 'react';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import EmailSubmitForm from './EmailSubmitForm';

export default function Email() {
  const [emailSent, setEmailSent] = useState(false);
  return (
    <div style={{ width: '100%' }}>
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
          'Enter the 6 digit number sent to your email'
        ) : (
          <>
            Enter your email address below and tap{' '}
            <b style={{ color: Color.green() }}>submit</b>
          </>
        )}
      </p>
      {!emailSent && <EmailSubmitForm onSetEmailSent={setEmailSent} />}
    </div>
  );
}
