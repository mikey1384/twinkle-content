import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import MakeAccount from './MakeAccount';
import CreateNewRepl from './CreateNewRepl';
import CopyAndPasteCode from './CopyAndPasteCode';
import MultiStepContainer from '../../components/MultiStepContainer';
import TaskComplete from '../../components/TaskComplete';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

ReplitVerifier.propTypes = {
  task: PropTypes.object.isRequired
};

export default function ReplitVerifier({ task }) {
  const { userId, state } = useMyState();
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateMissionState }
  } = useContentContext();

  const taskState = useMemo(
    () => state?.missions?.[task?.missionType] || {},
    [state?.missions, task?.missionType]
  );

  const {
    accountMade,
    correctCodeEntered,
    makeAccountOkayPressed,
    createReplOkayPressed
  } = taskState;

  const FirstButton = useMemo(() => {
    if (!makeAccountOkayPressed && !accountMade) {
      return {
        label: 'Okay',
        color: 'logoBlue',
        skeuomorphic: true,
        onClick: () => {
          window.open('https://replit.com');
          setTimeout(
            () => handleUpdateTaskProgress({ makeAccountOkayPressed: true }),
            1000
          );
        }
      };
    }
    return {
      label: 'I made an account',
      color: 'green',
      skeuomorphic: true
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [makeAccountOkayPressed, task.id]);

  const SecondButton = useMemo(() => {
    if (!createReplOkayPressed) {
      return {
        label: 'Okay',
        color: 'logoBlue',
        skeuomorphic: true,
        onClick: () => handleUpdateTaskProgress({ createReplOkayPressed: true })
      };
    }
    return {
      label: 'Yes, I did',
      color: 'green',
      skeuomorphic: true
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createReplOkayPressed, task.id]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      {!correctCodeEntered ? (
        <MultiStepContainer
          buttons={[FirstButton, SecondButton]}
          taskId={task.id}
          taskType={task.missionType}
        >
          <MakeAccount
            onSetOkayPressed={() =>
              handleUpdateTaskProgress({ makeAccountOkayPressed: true })
            }
            okayPressed={makeAccountOkayPressed}
          />
          <CreateNewRepl okayPressed={createReplOkayPressed} />
          <CopyAndPasteCode
            onCorrectCodeEntered={() =>
              handleUpdateTaskProgress({ correctCodeEntered: true })
            }
          />
        </MultiStepContainer>
      ) : (
        <TaskComplete
          taskId={task.id}
          passMessage="That's it! Excellent work"
          passMessageFontSize="2.2rem"
        />
      )}
    </ErrorBoundary>
  );

  async function handleUpdateTaskProgress(newState) {
    await updateMissionStatus({
      missionType: task.missionType,
      newStatus: newState
    });
    onUpdateMissionState({
      userId,
      missionType: task.missionType,
      newState
    });
  }
}
