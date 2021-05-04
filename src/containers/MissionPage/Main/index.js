import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import MissionContainer from './MissionContainer';
import { Switch, Route } from 'react-router-dom';
import TaskContainer from './TaskContainer';

Main.propTypes = {
  mission: PropTypes.object.isRequired,
  myAttempts: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Main({
  mission,
  myAttempts,
  onSetMissionState,
  style
}) {
  return (
    <ErrorBoundary style={{ width: '100%', ...style }}>
      {mission ? (
        <Switch>
          <Route
            path={`/missions/${mission.missionType}/:taskType`}
            render={({ match }) => (
              <TaskContainer match={match} mission={mission} />
            )}
          />
          <Route
            exact
            path={`/missions/${mission.missionType}`}
            render={() => (
              <MissionContainer
                mission={mission}
                myAttempts={myAttempts}
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
