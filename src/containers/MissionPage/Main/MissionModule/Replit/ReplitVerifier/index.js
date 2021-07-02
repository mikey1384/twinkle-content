import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CreateNewRepl from './CreateNewRepl';
import CopyAndPasteCode from './CopyAndPasteCode';
import MultiStepContainer from '../../components/MultiStepContainer';
import TaskComplete from '../../components/TaskComplete';

ReplitVerifier.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function ReplitVerifier({ task, onSetMissionState }) {
  const { accountMade, replCreated, correctCodeEntered } = task;
  const [okayPressed, setOkayPressed] = useState(false);
  const FirstButton = useMemo(() => {
    if (!okayPressed && !accountMade) {
      return {
        label: 'Okay',
        color: 'logoBlue',
        skeuomorphic: true,
        onClick: () => {
          window.open(`https://replit.com`);
          setTimeout(() => setOkayPressed(true), 1000);
        }
      };
    }
    return {
      label: 'I made an account',
      color: 'green',
      skeuomorphic: true,
      onClick: (goNext) => {
        onSetMissionState({
          missionId: task.id,
          newState: { accountMade: true }
        });
        goNext();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [okayPressed, task.id]);

  return (
    <ErrorBoundary style={{ width: '100%', marginTop: '1rem' }}>
      {!correctCodeEntered ? (
        <MultiStepContainer
          buttons={[FirstButton]}
          onSetMissionState={onSetMissionState}
          selectedIndex={task.selectedIndex}
          taskId={task.id}
        >
          <MakeAccount
            onSetOkayPressed={setOkayPressed}
            accountMade={!!accountMade}
          />
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
          <CopyAndPasteCode
            style={{ marginTop: correctCodeEntered ? '2rem' : '10rem' }}
            correctCodeEntered={!!correctCodeEntered}
            onCorrectCodeEntered={handleCorrectCodeEntered}
          />
        </MultiStepContainer>
      ) : (
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
