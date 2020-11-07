import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { useAppContext } from 'contexts';
import { isValidUsername, stringIsEmpty } from 'helpers/stringHelpers';

ChangeUsername.propTypes = {
  style: PropTypes.object
};

export default function ChangeUsername({ style }) {
  const {
    requestHelpers: { checkIfUsernameExists }
  } = useAppContext();
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setUsernameAvailable(false);
    setErrorMessage('');
    clearTimeout(timerRef.current);
    if (!stringIsEmpty(newUsername)) {
      timerRef.current = setTimeout(() => {
        handleUsernameInput(newUsername);
      }, 1000);
    }

    async function handleUsernameInput(username) {
      if (!isValidUsername(username)) {
        setErrorMessage(
          `${username} is not a valid username.${
            username.length < 3
              ? ' Make sure it is at least 3 characters long.'
              : ''
          }`
        );
      } else {
        const exists = await checkIfUsernameExists(username);
        if (exists) {
          setErrorMessage(`That username is already taken`);
        } else {
          setErrorMessage('');
          setUsernameAvailable(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {errorMessage && (
        <p style={{ color: 'red', fontSize: '1.3rem', marginTop: '0.5rem' }}>
          {errorMessage}
        </p>
      )}
      {usernameAvailable && (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            style={{ marginTop: '1rem' }}
            filled
            color="green"
            onClick={handleChangeUsername}
          >
            Change
          </Button>
        </div>
      )}
    </div>
  );

  function handleChangeUsername() {
    console.log(newUsername);
  }
}
