import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import MissionModule from '../MissionModule';
import ErrorBoundary from 'components/ErrorBoundary';
import LongText from 'components/Texts/LongText';
import RewardText from 'components/Texts/RewardText';
import ApprovedStatus from '../ApprovedStatus';
import PendingStatus from '../PendingStatus';
import { useAppContext, useMissionContext, useViewContext } from 'contexts';
import { mobileMaxWidth } from 'constants/css';
import { returnMissionThumb } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { panel } from '../../Styles';
import GoToNextTask from './GoToNextTask';

Task.propTypes = {
  task: PropTypes.object,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object,
  nextTaskType: PropTypes.string
};

export default function Task({
  task,
  task: {
    id: taskId,
    description,
    title,
    subtitle,
    fileUploadProgress,
    objective,
    xpReward,
    coinReward,
    retryable,
    missionType,
    uploadingFile
  },
  onSetMissionState,
  style,
  nextTaskType
}) {
  const checkMissionStatus = useAppContext(
    (v) => v.requestHelpers.checkMissionStatus
  );
  const myAttempts = useMissionContext((v) => v.state.myAttempts);
  const onUpdateMissionAttempt = useMissionContext(
    (v) => v.actions.onUpdateMissionAttempt
  );
  const pageVisible = useViewContext((v) => v.state.pageVisible);
  const myAttempt = useMemo(() => myAttempts[taskId], [myAttempts, taskId]);
  const approvedStatusShown = useMemo(
    () =>
      myAttempt?.status === 'pass' ||
      (myAttempt?.status === 'fail' && !myAttempt?.tryingAgain),
    [myAttempt?.status, myAttempt?.tryingAgain]
  );
  const missionModuleShown = useMemo(
    () =>
      !!retryable ||
      !myAttempt?.status ||
      (myAttempt?.status === 'fail' && myAttempt?.tryingAgain),
    [myAttempt?.status, myAttempt?.tryingAgain, retryable]
  );
  const taskThumb = useMemo(
    () => (missionType ? returnMissionThumb(missionType) : null),
    [missionType]
  );
  useEffect(() => {
    if (pageVisible) {
      handleCheckMissionStatus();
    }

    async function handleCheckMissionStatus() {
      const { filePath, feedback, status, reviewTimeStamp, reviewer } =
        await checkMissionStatus(taskId);
      if (status && !(status === 'fail' && myAttempt?.tryingAgain)) {
        onUpdateMissionAttempt({
          missionId: taskId,
          newState: { filePath, feedback, reviewer, reviewTimeStamp, status }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVisible]);

  return (
    <ErrorBoundary
      componentPath="TaskContainer/Task"
      className={panel}
      style={{
        paddingBottom: '2.5rem',
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <div style={{ width: 'CALC(80% - 1rem)', height: '100%' }}>
          <h1
            className={css`
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 2.3rem;
              }
            `}
          >
            {title}
          </h1>
          <p
            className={css`
              font-size: 1.7rem;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 1.5rem;
              }
            `}
          >
            {subtitle}
          </p>
        </div>
        <div style={{ width: '20%', height: '100%' }}>
          {taskThumb && (
            <img
              style={{ width: '100%', height: '100%', aspectFit: 'cover' }}
              src={taskThumb}
            />
          )}
        </div>
      </div>
      <LongText style={{ fontSize: '1.5rem' }}>{description}</LongText>
      {myAttempt?.status !== 'pending' && (
        <div
          style={{
            marginTop: '3rem'
          }}
        >
          <div>
            <p
              className={css`
                font-weight: bold;
                font-size: 2rem;
              `}
            >
              Objective:
            </p>
            <LongText
              className={css`
                font-size: 1.7rem;
                margin-top: 0.5rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.5rem;
                }
              `}
            >
              {objective}
            </LongText>
          </div>
          <RewardText
            style={{ marginTop: '2rem' }}
            xpReward={xpReward}
            coinReward={coinReward}
          />
        </div>
      )}
      {missionModuleShown && (
        <MissionModule
          mission={task}
          fileUploadProgress={fileUploadProgress}
          onSetMissionState={onSetMissionState}
          uploadingFile={uploadingFile}
          style={{ marginTop: '4.5rem' }}
        />
      )}
      {myAttempt?.status === 'pending' ? (
        <PendingStatus style={{ marginTop: '7rem' }} />
      ) : approvedStatusShown ? (
        <ApprovedStatus
          isTask
          missionId={taskId}
          xpReward={xpReward}
          coinReward={coinReward}
          myAttempt={myAttempt}
          style={{ marginTop: myAttempt?.status ? '7rem' : '3rem' }}
        />
      ) : null}
      {myAttempt?.status === 'pass' && (
        <GoToNextTask
          style={{ marginTop: '5rem' }}
          nextTaskType={nextTaskType}
        />
      )}
    </ErrorBoundary>
  );
}
