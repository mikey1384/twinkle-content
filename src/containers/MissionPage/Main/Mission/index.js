import React from 'react';
import PropTypes from 'prop-types';
import LongText from 'components/Texts/LongText';
import Submit from './Submit';
import ApprovedStatus from './ApprovedStatus';
import PendingStatus from './PendingStatus';
import { panel } from '../../Styles';
import { gifTable } from 'constants/defaultValues';

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
    myAttempt
  },
  style,
  onSetMissionState
}) {
  return (
    <div
      className={panel}
      style={{
        paddingBottom: '3rem',
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
        <LongText style={{ fontSize: '1.5rem' }}>{description}</LongText>
      </div>
      {myAttempt?.status === 'pending' ? (
        <PendingStatus style={{ marginTop: '3rem' }} />
      ) : myAttempt?.status === 'approved' ||
        myAttempt?.status === 'rejected' ? (
        <ApprovedStatus
          mission={mission}
          onSetMissionState={onSetMissionState}
          style={{ marginTop: '2rem' }}
        />
      ) : (
        <Submit
          mission={mission}
          fileUploadComplete={fileUploadComplete}
          fileUploadProgress={fileUploadProgress}
          onSetMissionState={onSetMissionState}
        />
      )}
    </div>
  );
}
