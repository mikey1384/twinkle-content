import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CreateNewRepl from './CreateNewRepl';
import CopyAndPasteCode from './CopyAndPasteCode';
import MultiStepContainer from '../../components/MultiStepContainer';
import TaskComplete from '../../components/TaskComplete';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

ReplitVerifier.propTypes = {
  task: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function ReplitVerifier({ task, onSetMissionState }) {
  const { accountMade, replCreated, correctCodeEntered } = task;
  const [makeAccountOkayPressed, setMakeAccountOkayPressed] = useState(false);
  const [createReplOkayPressed, setCreateReplOkayPressed] = useState(false);
  const [helpButtonPressed, setHelpButtonPressed] = useState(false);

  const FirstButton = useMemo(() => {
    if (!makeAccountOkayPressed && !accountMade) {
      return {
        label: 'Okay',
        color: 'logoBlue',
        skeuomorphic: true,
        onClick: () => {
          window.open(`https://replit.com`);
          setTimeout(() => setMakeAccountOkayPressed(true), 1000);
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
  }, [makeAccountOkayPressed, task.id]);

  const SecondButton = useMemo(() => {
    if (!createReplOkayPressed && !replCreated) {
      return {
        label: 'Okay',
        color: 'logoBlue',
        skeuomorphic: true,
        onClick: () => setCreateReplOkayPressed(true)
      };
    }
    return {
      label: 'Yes, I did',
      color: 'green',
      skeuomorphic: true,
      onClick: (goNext) => {
        onSetMissionState({
          missionId: task.id,
          newState: { replCreated: true }
        });
        goNext();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createReplOkayPressed, task.id]);

  return (
    <ErrorBoundary style={{ width: '100%', marginTop: '1rem' }}>
      {!correctCodeEntered ? (
        <MultiStepContainer
          buttons={[FirstButton, SecondButton]}
          onSetMissionState={onSetMissionState}
          selectedIndex={task.selectedIndex}
          taskId={task.id}
        >
          <MakeAccount
            onSetOkayPressed={setMakeAccountOkayPressed}
            accountMade={!!accountMade}
            okayPressed={makeAccountOkayPressed}
          />
          <CreateNewRepl
            replCreated={!!replCreated}
            okayPressed={createReplOkayPressed}
          />
          <CopyAndPasteCode
            style={{ marginTop: correctCodeEntered ? '2rem' : '10rem' }}
            correctCodeEntered={!!correctCodeEntered}
            onCorrectCodeEntered={handleCorrectCodeEntered}
          />
        </MultiStepContainer>
      ) : (
        <TaskComplete
          taskId={task.id}
          passMessage="That's it! Excellent work"
          passMessageFontSize="2.2rem"
        />
      )}
      {!correctCodeEntered && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}
        >
          {!helpButtonPressed ? (
            <Button
              style={{ marginTop: '7rem' }}
              skeuomorphic
              color="pink"
              onClick={() => setHelpButtonPressed(true)}
            >
              {`I don't understand what I am supposed to do`}
            </Button>
          ) : (
            <div style={{ marginTop: '3rem', marginBottom: '-1rem' }}>
              Read the <b style={{ color: Color.green() }}>tutorial</b> below{' '}
              <Icon icon="arrow-down" /> to learn how to create a Next.js Repl
            </div>
          )}
        </div>
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
