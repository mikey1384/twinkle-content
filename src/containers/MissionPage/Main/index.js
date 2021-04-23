import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import SingleMissionPage from './SingleMissionPage';
import { Switch, Route } from 'react-router-dom';
import MultiMissionPage from './MultiMissionPage';

Main.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Main({ mission, onSetMissionState, style }) {
  return (
    <ErrorBoundary style={{ width: '100%', ...style }}>
      {mission ? (
        <Switch>
          <Route
            path={`/missions/${mission.missionType}/:subMissionPath`}
            render={() => <MultiMissionPage />}
          />
          <Route
            exact
            path={`/missions/${mission.missionType}`}
            render={() => (
              <SingleMissionPage
                mission={mission}
                onSetMissionState={onSetMissionState}
              />
            )}
          />
        </Switch>
      ) : (
        <Loading text="Loading Mission..." />
      )}
    </ErrorBoundary>
  );
}
