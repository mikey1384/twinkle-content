import React, { useMemo } from 'react';
import { useMyState } from 'helpers/hooks';
import EmailVerifier from './EmailVerifier';
import EmailExists from './EmailExists';
import ErrorBoundary from 'components/ErrorBoundary';

export default function Email() {
  const { verifiedEmail, emailMissionAttempted } = useMyState();
  const conditionPassed = useMemo(() => !!verifiedEmail, [verifiedEmail]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      {conditionPassed ? (
        <EmailExists emailMissionAttempted={emailMissionAttempted} />
      ) : (
        <EmailVerifier />
      )}
    </ErrorBoundary>
  );
}
