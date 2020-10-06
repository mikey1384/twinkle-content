import React from 'react';
import PropTypes from 'prop-types';
import LongText from 'components/Texts/LongText';
import Submit from './Submit';
import { panel } from '../Styles';
import { gifTable } from 'constants/defaultValues';

Mission.propTypes = {
  attachment: PropTypes.object,
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  objective: PropTypes.string,
  style: PropTypes.object,
  missionType: PropTypes.string,
  missionId: PropTypes.number,
  onSetMissionState: PropTypes.func
};
export default function Mission({
  attachment,
  fileUploadComplete,
  fileUploadProgress,
  title,
  subtitle,
  description,
  objective,
  style,
  missionType,
  missionId,
  onSetMissionState
}) {
  return (
    <div
      className={panel}
      style={{ background: '#fff', paddingBottom: '3rem', ...style }}
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
      <Submit
        attachment={attachment}
        fileUploadComplete={fileUploadComplete}
        fileUploadProgress={fileUploadProgress}
        missionId={missionId}
        missionType={missionType}
        onSetMissionState={onSetMissionState}
      />
    </div>
  );
}
