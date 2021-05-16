import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CreateNewRepl from './CreateNewRepl';
import CopyAndPasteCode from './CopyAndPasteCode';
import TaskComplete from '../../components/TaskComplete';

ReplitVerifier.propTypes = {
  taskId: PropTypes.number.isRequired
};

export default function ReplitVerifier({ taskId }) {
  const [accountMade, setAccountMade] = useState(false);
  const [replCreated, setReplCreated] = useState(false);
  const [correctCodeEntered, setCorrectCodeEntered] = useState(false);

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
          style={{ marginTop: correctCodeEntered ? '2rem' : '10rem' }}
          correctCodeEntered={correctCodeEntered}
          onCorrectCodeEntered={handleCorrectCodeEntered}
        />
      )}
      {correctCodeEntered && (
        <TaskComplete
          style={{ marginTop: '10rem' }}
          taskId={taskId}
          passMessage="That's it! Excellent work"
          passMessageFontSize="2.2rem"
        />
      )}
    </ErrorBoundary>
  );

  function handleCorrectCodeEntered() {
    setCorrectCodeEntered(true);
  }
}
