import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getStatuses } from '../helpers/statuses';
import Key from './Key';
import { ENTER_TEXT, DELETE_TEXT } from '../constants/strings';
import { localeAwareUpperCase } from '../helpers/words';

Keyboard.propTypes = {
  isEnterReady: PropTypes.bool,
  onChar: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  guesses: PropTypes.array,
  isRevealing: PropTypes.bool,
  maxWordLength: PropTypes.number,
  solution: PropTypes.string,
  style: PropTypes.object
};

export default function Keyboard({
  isEnterReady,
  onChar,
  onDelete,
  onEnter,
  guesses,
  isRevealing,
  maxWordLength,
  solution,
  style
}) {
  const charStatuses = getStatuses({ guesses, solution });

  const onClick = (value) => {
    if (value === 'ENTER') {
      onEnter();
    } else if (value === 'DELETE') {
      onDelete();
    } else {
      onChar(value);
    }
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.code === 'Enter') {
        onEnter();
      } else if (e.code === 'Backspace') {
        onDelete();
      } else {
        const key = localeAwareUpperCase(e.key);
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          onChar(key);
        }
      }
    };
    window.addEventListener('keyup', listener);
    return function cleanUp() {
      window.removeEventListener('keyup', listener);
    };
  }, [onEnter, onDelete, onChar]);

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2px'
        }}
      >
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2px'
        }}
      >
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            maxWordLength={maxWordLength}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Key
          status={isEnterReady ? 'ready' : ''}
          width={65.4}
          value="ENTER"
          onClick={onClick}
        >
          {ENTER_TEXT}
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={65.4} value="DELETE" onClick={onClick}>
          {DELETE_TEXT}
        </Key>
      </div>
    </div>
  );
}
