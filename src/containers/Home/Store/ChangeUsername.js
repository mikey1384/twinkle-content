import React, { useEffect, useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { useAppContext } from 'contexts';
import { priceTable } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';
import { isValidUsername, stringIsEmpty } from 'helpers/stringHelpers';

ChangeUsername.propTypes = {
  style: PropTypes.object
};

export default function ChangeUsername({ style }) {
  const {
    requestHelpers: { changeUsername, checkIfUsernameExists }
  } = useAppContext();
  const { twinkleCoins } = useMyState();
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const timerRef = useRef(null);
  const disabled = useMemo(() => {
    return !usernameAvailable || twinkleCoins < priceTable.username;
  }, [twinkleCoins, usernameAvailable]);

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
          if (twinkleCoins < priceTable.username) {
            setErrorMessage(`You don't have enough Twinkle Coins`);
          } else {
            setErrorMessage('');
            setUsernameAvailable(true);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUsername]);

  return (
    <div style={style}>
      <div>
        <Input
          maxLength={20}
          placeholder="Enter new username"
          onChange={(text) => setNewUsername(text)}
          value={newUsername}
        />
      </div>
      <div
        style={{
          position: 'relative',
          height: '4rem',
          marginTop: '0.5rem'
        }}
      >
        <div
          style={{
            color: usernameAvailable ? Color.green() : 'red',
            fontSize: '1.3rem',
            fontWeight: usernameAvailable ? 'bold' : 'normal'
          }}
        >
          {usernameAvailable
            ? `This username is available. Press "Change"`
            : errorMessage}
        </div>
        <Button
          style={{ position: 'absolute', top: '0.5rem', right: 0 }}
          filled
          color="green"
          disabled={disabled}
          onClick={handleChangeUsername}
        >
          Change
          <div style={{ marginLeft: '0.7rem' }}>
            (<Icon icon={['far', 'badge-dollar']} />
            <span style={{ marginLeft: '0.3rem' }}>{priceTable.username}</span>)
          </div>
        </Button>
      </div>
    </div>
  );

  async function handleChangeUsername() {
    const { coins, alreadyExists } = await changeUsername(newUsername);
    if (alreadyExists) {
      setUsernameAvailable(false);
      setErrorMessage(`That username is already taken`);
    } else {
      console.log(coins);
    }
  }
}
