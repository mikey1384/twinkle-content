import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import PasteCodeToProject from './PasteCodeToProject';

export default function ReplitVerifier() {
  const [accountMade, setAccountMade] = useState(false);
  return (
    <ErrorBoundary style={{ width: '100%', marginTop: '1rem' }}>
      <MakeAccount
        accountMade={accountMade}
        onMakeAccount={() => setAccountMade(true)}
      />
      {accountMade && <PasteCodeToProject />}
    </ErrorBoundary>
  );
}
