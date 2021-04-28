import React from 'react';
import PropTypes from 'prop-types';
import MissionModule from '../MissionModule';
import ErrorBoundary from 'components/ErrorBoundary';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { gifTable } from 'constants/defaultValues';
import { panel } from '../../Styles';

Task.propTypes = {
  task: PropTypes.object,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Task({
  task,
  task: { id: taskId, title, subtitle, fileUploadComplete, fileUploadProgress },
  onSetMissionState,
  style
}) {
  return (
    <ErrorBoundary
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
        <div style={{ width: '80%' }}>
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
        <div style={{ width: '20%' }}>
          <img style={{ width: '100%' }} src={gifTable[taskId]} />
        </div>
      </div>
      <MissionModule
        mission={task}
        fileUploadComplete={fileUploadComplete}
        fileUploadProgress={fileUploadProgress}
        onSetMissionState={onSetMissionState}
      />
    </ErrorBoundary>
  );
}
