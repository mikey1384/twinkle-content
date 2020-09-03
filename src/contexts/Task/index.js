import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import TaskActions from './actions';
import TaskReducer from './reducer';

export const TaskContext = createContext();
export const initialTaskState = {
  tasks: [],
  loadMoreButton: false,
  taskObj: {}
};

TaskContextProvider.propTypes = {
  children: PropTypes.node
};

export function TaskContextProvider({ children }) {
  const [taskState, taskDispatch] = useReducer(TaskReducer, initialTaskState);
  return (
    <TaskContext.Provider
      value={{
        state: taskState,
        actions: TaskActions(taskDispatch)
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
