import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CreateNewRepl from './CreateNewRepl';
import CopyAndPasteCode from './CopyAndPasteCode';

export default function ReplitVerifier() {
  const [accountMade, setAccountMade] = useState(false);
  const [replCreated, setReplCreated] = useState(false);

  return (
    <ErrorBoundary style={{ width: '100%', marginTop: '1rem' }}>
      <MakeAccount
        accountMade={accountMade}
        onMakeAccount={() => setAccountMade(true)}
      />
      {accountMade && (
        <CreateNewRepl
          style={{ marginTop: replCreated ? '2rem' : '10rem' }}
          replCreated={replCreated}
          onCreateRepl={() => setReplCreated(true)}
        />
      )}
      {replCreated && (
        <CopyAndPasteCode
          style={{ marginTop: '10rem' }}
          onCorrectCodeEntered={handleCorrectCodeEntered}
        />
      )}
    </ErrorBoundary>
  );

  function handleCorrectCodeEntered() {
    console.log('passed yay');
  }
}
