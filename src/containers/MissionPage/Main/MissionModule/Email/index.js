import React, { useState, useMemo, useRef } from 'react';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { isValidEmail } from 'helpers/stringHelpers';
import { useAppContext } from 'contexts';

export default function Email() {
  const {
    requestHelpers: { sendVerificationOTPEmail }
  } = useAppContext();
  const [sendingEmail, setSendingEmail] = useState(false);
  const sendingEmailRef = useRef(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const emailIsValid = useMemo(() => isValidEmail(email), [email]);
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
      {!emailSent && (
        <div
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
            type="email"
            maxLength={100}
            placeholder="somebody@something.com"
            onChange={setEmail}
            value={email}
          />
          <div style={{ marginTop: '1.5rem' }}>
            {errorMsg && <p style={{ color: Color.red() }}>{errorMsg}</p>}
            <Button
              disabled={!emailIsValid || sendingEmail}
              style={{ fontSize: '1.7rem' }}
              filled
              color="green"
              onClick={() => handleConfirmEmail(email)}
            >
              {sendingEmail ? (
                <>
                  <Icon style={{ marginLeft: '0.7rem' }} icon="spinner" pulse />
                  <span style={{ marginLeft: '0.7rem' }}>One moment...</span>
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  async function handleConfirmEmail(email) {
    if (sendingEmailRef.current) return;
    try {
      sendingEmailRef.current = true;
      setSendingEmail(true);
      const success = await sendVerificationOTPEmail(email);
      sendingEmailRef.current = false;
      setSendingEmail(false);
      if (success) {
        setEmailSent(true);
      } else {
        setErrorMsg('An error occurred while sending a verification email');
      }
    } catch (error) {
      sendingEmailRef.current = false;
      setSendingEmail(false);
      console.error(error);
    }
  }
}
