import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';

export default function VerificationCodeInput() {
  return (
    <ErrorBoundary>
      <div>
        <div>This is verification code input</div>
      </div>
    </ErrorBoundary>
  );
}
