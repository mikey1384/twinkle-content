import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import { isValidUsername, stringIsEmpty } from 'helpers/stringHelpers';

ChangeUsername.propTypes = {
  style: PropTypes.object
};

export default function ChangeUsername({ style }) {
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    setErrorMessage('');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleUsernameInput(newUsername);
    }, 1000);

    function handleUsernameInput(username) {
      if (!stringIsEmpty(username) && !isValidUsername(username)) {
        setErrorMessage(
          `${username} is not a valid username.${
            username.length < 3
              ? ' Make sure it is at least 3 characters long.'
              : ''
          }`
        );
      } else {
        setErrorMessage('');
      }
    }
  }, [newUsername]);

  return (
    <div style={style}>
      <Input
        maxLength={20}
        placeholder="Enter new username"
        style={{ marginTop: '1rem' }}
        onChange={(text) => setNewUsername(text)}
        value={newUsername}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
