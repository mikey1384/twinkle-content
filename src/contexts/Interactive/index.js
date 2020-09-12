import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import InteractiveActions from './actions';
import InteractiveReducer from './reducer';

export const InteractiveContext = createContext();
export const initialInteractiveState = {};

InteractiveContextProvider.propTypes = {
  children: PropTypes.node
};

export function InteractiveContextProvider({ children }) {
  const [interactiveState, interactiveDispatch] = useReducer(
    InteractiveReducer,
    initialInteractiveState
  );

  return (
    <InteractiveContext.Provider
      value={{
        state: interactiveState,
        actions: InteractiveActions(interactiveDispatch)
      }}
    >
      {children}
    </InteractiveContext.Provider>
  );
}
