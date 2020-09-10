import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import MissionActions from './actions';
import MissionReducer from './reducer';

export const MissionContext = createContext();
export const initialMissionState = {
  missions: [],
  loadMoreButton: false,
  taskObj: {}
};

MissionContextProvider.propTypes = {
  children: PropTypes.node
};

export function MissionContextProvider({ children }) {
  const [taskState, taskDispatch] = useReducer(
    MissionReducer,
    initialMissionState
  );
  return (
    <MissionContext.Provider
      value={{
        state: taskState,
        actions: MissionActions(taskDispatch)
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}
