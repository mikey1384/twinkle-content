import React from 'react';
import PropTypes from 'prop-types';
import Mission from './Mission';
import Tutorial from './Tutorial';
import GrammarReview from './GrammarReview';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

Main.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Main({ mission, onSetMissionState, style }) {
  return (
    <ErrorBoundary style={{ width: '100%', ...style }}>
      {mission ? (
        <div style={{ width: '100%' }}>
          <Mission
            style={{ width: '100%' }}
            mission={mission}
            onSetMissionState={onSetMissionState}
          />
          {mission.missionType === 'grammar' && <GrammarReview />}
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
    </ErrorBoundary>
  );
}
