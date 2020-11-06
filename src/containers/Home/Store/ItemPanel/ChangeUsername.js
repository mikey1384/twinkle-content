import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import { isValidUsername, stringIsEmpty } from 'helpers/stringHelpers';

ChangeUsername.propTypes = {
  style: PropTypes.object
};

export default function ChangeUsername({ style }) {
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (!stringIsEmpty(newUsername) && !isValidUsername(newUsername)) {
      setErrorMessage(
        `${newUsername} is not a valid username.${
          newUsername.length < 3
            ? ' Make sure it is at least 3 characters long.'
            : ''
        }`
      );
    } else {
      setErrorMessage('');
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
