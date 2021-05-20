import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CreateNewRepl from './CreateNewRepl';
import CopyAndPasteCode from './CopyAndPasteCode';
import TaskComplete from '../../components/TaskComplete';

ReplitVerifier.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function ReplitVerifier({ task, onSetMissionState }) {
  const { accountMade, replCreated, correctCodeEntered } = task;

  return (
    <ErrorBoundary style={{ width: '100%', marginTop: '1rem' }}>
      <MakeAccount
        accountMade={!!accountMade}
        onMakeAccount={() =>
          onSetMissionState({
            missionId: task.id,
            newState: { accountMade: true }
          })
        }
      />
      {accountMade && (
        <CreateNewRepl
          style={{ marginTop: replCreated ? '2rem' : '10rem' }}
          replCreated={!!replCreated}
          onCreateRepl={() =>
            onSetMissionState({
              missionId: task.id,
              newState: { replCreated: true }
            })
          }
        />
      )}
      {replCreated && (
        <CopyAndPasteCode
          style={{ marginTop: correctCodeEntered ? '2rem' : '10rem' }}
          correctCodeEntered={!!correctCodeEntered}
          onCorrectCodeEntered={handleCorrectCodeEntered}
        />
      )}
      {correctCodeEntered && (
        <TaskComplete
          style={{ marginTop: '10rem' }}
          taskId={task.id}
          passMessage="That's it! Excellent work"
          passMessageFontSize="2.2rem"
        />
      )}
    </ErrorBoundary>
  );

  function handleCorrectCodeEntered() {
    onSetMissionState({
      missionId: task.id,
      newState: { correctCodeEntered: true }
    });
  }
}
