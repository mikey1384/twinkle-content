import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import MissionActions from './actions';
import MissionReducer from './reducer';

export const MissionContext = createContext();
export const initialMissionState = {
  missions: [],
  loadMoreButton: false,
  missionObj: {},
  missionIdHash: {},
  prevUserId: null,
  selectedMissionListTab: ''
};

MissionContextProvider.propTypes = {
  children: PropTypes.node
};

export function MissionContextProvider({ children }) {
  const [missionState, missionDispatch] = useReducer(
    MissionReducer,
    initialMissionState
  );
  return (
    <MissionContext.Provider
      value={{
        state: missionState,
        actions: MissionActions(missionDispatch)
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}
