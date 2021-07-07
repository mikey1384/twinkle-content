import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import MultiStepContainer from '../components/MultiStepContainer';
import WebsiteVerfier from './WebsiteVerifier';
import MakeAccount from './MakeAccount';
import FinalizeYourCode from './FinalizeYourCode';
import ConnectReplToGitHub from './ConnectReplToGitHub';
import UpdateYourRepl from './UpdateYourRepl';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

LaunchTheWebsite.propTypes = {
  style: PropTypes.object,
  task: PropTypes.object
};

export default function LaunchTheWebsite({ style, task }) {
  const { userId, state, username } = useMyState();
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateUserMissionState }
  } = useContentContext();
  const taskState = useMemo(
    () => state?.missions?.[task?.missionType] || {},
    [state?.missions, task?.missionType]
  );
  const { makeAccountOkayPressed } = taskState;
  const FirstButton = useMemo(() => {
    return {
      label: 'Save and move on',
      color: 'green',
      skeuomorphic: true,
      onClick: async (onNext) => {
        await handleSaveCode(taskState.code);
        onNext();
      }
    };

    async function handleSaveCode(code) {
      await updateMissionStatus({
        missionType: task.missionType,
        newStatus: { code }
      });
    }
  }, [task.missionType, taskState.code, updateMissionStatus]);

  const SecondButton = useMemo(() => {
    if (!makeAccountOkayPressed) {
      return {
        label: 'Okay',
        color: 'logoBlue',
        noArrow: true,
        skeuomorphic: true,
        onClick: () => {
          window.open('https://vercel.com');
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

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  return (
    <ErrorBoundary style={style}>
      <MultiStepContainer
        buttons={[
          FirstButton,
          SecondButton,
          { label: 'Yes I did', color: 'green', skeuomorphic: true }
        ]}
        taskId={task.id}
        taskType={task.missionType}
      >
        <FinalizeYourCode
          code={taskState.code}
          onSetCode={handleSetCode}
          task={task}
          username={username}
        />
        <MakeAccount
          onSetOkayPressed={() =>
            handleUpdateTaskProgress({ makeAccountOkayPressed: true })
          }
          okayPressed={makeAccountOkayPressed}
        />
        <UpdateYourRepl code={taskState.code} />
        <ConnectReplToGitHub />
        <WebsiteVerfier />
      </MultiStepContainer>
    </ErrorBoundary>
  );

  function handleSetCode(code) {
    onUpdateUserMissionState({
      userId,
      missionType: task.missionType,
      newState: { code }
    });
  }

  async function handleUpdateTaskProgress(newState) {
    await updateMissionStatus({
      missionType: task.missionType,
      newStatus: newState
    });
    onUpdateUserMissionState({
      userId,
      missionType: task.missionType,
      newState
    });
  }
}
