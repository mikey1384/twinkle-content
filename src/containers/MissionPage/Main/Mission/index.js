import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import LongText from 'components/Texts/LongText';
import Main from './Main';
import ApprovedStatus from './ApprovedStatus';
import PendingStatus from './PendingStatus';
import RewardText from 'components/Texts/RewardText';
import ErrorBoundary from 'components/ErrorBoundary';
import { panel } from '../../Styles';
import { gifTable } from 'constants/defaultValues';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useViewContext, useAppContext, useMissionContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Mission.propTypes = {
  style: PropTypes.object,
  onSetMissionState: PropTypes.func,
  mission: PropTypes.object
};

export default function Mission({
  mission,
  mission: {
    fileUploadComplete,
    fileUploadProgress,
    title,
    subtitle,
    description,
    objective,
    id: missionId,
    myAttempt,
    xpReward,
    coinReward,
    repeatXpReward,
    repeatCoinReward
  },
  style,
  onSetMissionState
}) {
  const {
    requestHelpers: { checkMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateMissionAttempt }
  } = useMissionContext();
  const {
    state: { pageVisible }
  } = useViewContext();

  const isRepeating = useMemo(
    () => myAttempt?.status === 'pass' && !!mission.repeatable,
    [mission.repeatable, myAttempt?.status]
  );

  useEffect(() => {
    if (pageVisible) {
      handleCheckMissionStatus();
    }

    async function handleCheckMissionStatus() {
      const { filePath, feedback, status } = await checkMissionStatus(
        missionId
      );
      if (status && !(status === 'fail' && myAttempt?.tryingAgain)) {
        onUpdateMissionAttempt({
          missionId,
          newState: { filePath, feedback, status }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVisible]);

  const { canEdit } = useMyState();
  return (
    <ErrorBoundary
      className={`${panel} ${
        canEdit
          ? ''
          : css`
              @media (max-width: ${mobileMaxWidth}) {
                border-top: 0;
              }
            `
      }`}
      style={{
        paddingBottom: '2.5rem',
        ...style
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>{title}</h1>
          <p style={{ fontSize: '1.7rem' }}>{subtitle}</p>
        </div>
        <div style={{ width: '20%' }}>
          <img style={{ width: '100%' }} src={gifTable[missionId]} />
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
            <p style={{ fontWeight: 'bold', fontSize: '2rem' }}>Objective:</p>
            <LongText
              style={{
                fontSize: '1.7rem',
                marginTop: '0.5rem'
              }}
            >
              {objective}
            </LongText>
          </div>
          <RewardText
            checked={isRepeating}
            style={{ marginTop: '2rem' }}
            xpReward={xpReward}
            coinReward={coinReward}
          />
          {isRepeating && (
            <RewardText
              isRepeating
              style={{ marginTop: '1rem' }}
              xpReward={repeatXpReward}
              coinReward={repeatCoinReward}
            />
          )}
        </div>
      )}
      {myAttempt?.status === 'pending' ? (
        <PendingStatus style={{ marginTop: '7rem' }} />
      ) : (!mission.repeatable && myAttempt?.status === 'pass') ||
        (myAttempt?.status === 'fail' && !myAttempt?.tryingAgain) ? (
        <ApprovedStatus mission={mission} style={{ marginTop: '3rem' }} />
      ) : (
        <Main
          mission={mission}
          isRepeating={isRepeating}
          fileUploadComplete={fileUploadComplete}
          fileUploadProgress={fileUploadProgress}
          onSetMissionState={onSetMissionState}
          style={{ marginTop: '4.5rem' }}
        />
      )}
    </ErrorBoundary>
  );
}
