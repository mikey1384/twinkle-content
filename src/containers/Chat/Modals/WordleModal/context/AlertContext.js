import React, { createContext, useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ALERT_TIME_MS } from '../constants/settings';

export const AlertContext = createContext({
  status: 'success',
  message: null,
  isVisible: false,
  showSuccess: () => null,
  showError: () => null
});
AlertContext.displayName = 'AlertContext';

export const useAlert = () => useContext(AlertContext);

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired
};
export function AlertProvider({ children }) {
  const [status, setStatus] = useState('success');
  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback(
    (showStatus, newMessage, options) => {
      const {
        delayMs = 0,
        persist,
        onClose,
        durationMs = ALERT_TIME_MS
      } = options || {};

      setTimeout(() => {
        setStatus(showStatus);
        setMessage(newMessage);
        setIsVisible(true);

        if (!persist) {
          setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
              onClose();
            }
          }, durationMs);
        }
      }, delayMs);
    },
    [setStatus, setMessage, setIsVisible]
  );

  const showError = useCallback(
    (newMessage, options) => {
      show('error', newMessage, options);
    },
    [show]
  );

  const showSuccess = useCallback(
    (newMessage, options) => {
      show('success', newMessage, options);
    },
    [show]
  );

  return (
    <AlertContext.Provider
      value={{
        status,
        message,
        isVisible,
        showError,
        showSuccess
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}
