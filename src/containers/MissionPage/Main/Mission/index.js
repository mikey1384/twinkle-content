import React from 'react';
import PropTypes from 'prop-types';
import LongText from 'components/Texts/LongText';
import Submit from './Submit';
import ApprovedStatus from './ApprovedStatus';
import PendingStatus from './PendingStatus';
import RewardText from 'components/Texts/RewardText';
import { panel } from '../../Styles';
import { gifTable } from 'constants/defaultValues';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
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
    coinReward
  },
  style,
  onSetMissionState
}) {
  const { canEdit } = useMyState();
  return (
    <div
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
            style={{ marginTop: '2rem' }}
            xpReward={xpReward}
            coinReward={coinReward}
          />
        </div>
      )}
      {myAttempt?.status === 'pending' ? (
        <PendingStatus style={{ marginTop: '7rem' }} />
      ) : myAttempt?.status === 'pass' || myAttempt?.status === 'fail' ? (
        <ApprovedStatus
          mission={mission}
          onSetMissionState={onSetMissionState}
          style={{ marginTop: '3rem' }}
        />
      ) : (
        <Submit
          mission={mission}
          fileUploadComplete={fileUploadComplete}
          fileUploadProgress={fileUploadProgress}
          onSetMissionState={onSetMissionState}
          style={{ marginTop: '4.5rem' }}
        />
      )}
    </div>
  );
}
