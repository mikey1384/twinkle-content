import React from 'react';
import PropTypes from 'prop-types';
import Mission from './Mission';
import Tutorial from './Tutorial';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

Main.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Main({ mission, onSetMissionState, style }) {
  return (
    <div style={{ width: '100%', ...style }}>
      {mission ? (
        <div style={{ width: '100%' }}>
          <Mission
            style={{ width: '100%' }}
            mission={mission}
            onSetMissionState={onSetMissionState}
          />
          <Tutorial
            mission={mission}
            className={css`
              margin-top: 5rem;
              margin-bottom: 1rem;
              width: 100%;
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: 2rem;
              }
            `}
            onSetMissionState={onSetMissionState}
          />
        </div>
      ) : (
        <Loading text="Loading Mission..." />
      )}
    </div>
  );
}
