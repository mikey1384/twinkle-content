import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import { getGuessStatuses } from '../helpers/statuses';
import { unicodeSplit } from '../helpers/words';

CompletedRow.propTypes = {
  guess: PropTypes.string.isRequired,
  isRevealing: PropTypes.bool,
  isWaving: PropTypes.bool
};

export default function CompletedRow({ guess, isRevealing, isWaving }) {
  const statuses = getGuessStatuses(guess);
  const splitGuess = unicodeSplit(guess);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '0.5rem'
      }}
    >
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={statuses[i]}
          position={i}
          isWaving={isWaving}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  );
}
