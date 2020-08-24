import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import TaskActions from './actions';
import TaskReducer from './reducer';

export const TaskContext = createContext();
export const initialTaskState = {
  tasks: [],
  loadMoreButton: false
};

TaskContextProvider.propTypes = {
  children: PropTypes.node
};

export function TaskContextProvider({ children }) {
  const [tasksState, tasksDispatch] = useReducer(TaskReducer, initialTaskState);
  return (
    <TaskContext.Provider
      value={{
        state: tasksState,
        actions: TaskActions(tasksDispatch)
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
