import React, { useState, useMemo } from 'react';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { isValidEmail } from 'helpers/stringHelpers';
import { useAppContext } from 'contexts';

export default function Email() {
  const {
    requestHelpers: { sendVerificationCodeEmail }
  } = useAppContext();
  const [email, setEmail] = useState('');
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
        Enter your email address below and tap{' '}
        <b style={{ color: Color.green() }}>submit</b>
      </p>
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
          <Button
            disabled={!emailIsValid}
            style={{ fontSize: '1.7rem' }}
            filled
            color="green"
            onClick={handleConfirmEmail}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );

  async function handleConfirmEmail() {
    await sendVerificationCodeEmail(email);
  }
}
