import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CopyCode from './CopyCode';

export default function ReplitVerifier() {
  const [accountMade, setAccountMade] = useState(false);
  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <MakeAccount
        accountMade={accountMade}
        onMakeAccount={() => setAccountMade(true)}
      />
      {accountMade && <CopyCode />}
    </ErrorBoundary>
  );
}
