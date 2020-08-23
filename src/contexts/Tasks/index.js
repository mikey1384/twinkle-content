import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import TasksActions from './actions';
import TasksReducer from './reducer';

export const TasksContext = createContext();
export const initialTasksState = {
  tasks: [],
  loadMoreButton: false
};

TasksContextProvider.propTypes = {
  children: PropTypes.node
};

export function TasksContextProvider({ children }) {
  const [tasksState, tasksDispatch] = useReducer(
    TasksReducer,
    initialTasksState
  );
  return (
    <TasksContext.Provider
      value={{
        state: tasksState,
        actions: TasksActions(tasksDispatch)
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
