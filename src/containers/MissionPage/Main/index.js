import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import SingleMissionPage from './SingleMissionPage';

Main.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Main({ mission, onSetMissionState, style }) {
  return (
    <ErrorBoundary style={{ width: '100%', ...style }}>
      {mission ? (
        <SingleMissionPage
          mission={mission}
          onSetMissionState={onSetMissionState}
        />
      ) : (
        <Loading text="Loading Mission..." />
      )}
    </ErrorBoundary>
  );
}
