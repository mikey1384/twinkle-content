import React from 'react';
import { useMyState } from 'helpers/hooks';
import EmailVerifier from './EmailVerifier';

export default function Email() {
  const { userId, verifiedEmail, emailMissionAttempted } = useMyState();

  console.log(userId, verifiedEmail, emailMissionAttempted);

  return (
    <div style={{ width: '100%' }}>
      <EmailVerifier />
    </div>
  );
}
