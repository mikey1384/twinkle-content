import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CreateNewRepl from './CreateNewRepl';

export default function ReplitVerifier() {
  const [accountMade, setAccountMade] = useState(false);
  return (
    <ErrorBoundary style={{ width: '100%', marginTop: '1rem' }}>
      <MakeAccount
        accountMade={accountMade}
        onMakeAccount={() => setAccountMade(true)}
      />
      {accountMade && <CreateNewRepl style={{ marginTop: '2.5rem' }} />}
    </ErrorBoundary>
  );
}
