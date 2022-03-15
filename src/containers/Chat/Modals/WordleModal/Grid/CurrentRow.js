import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import { MAX_WORD_LENGTH } from '../constants/settings';
import { unicodeSplit } from '../lib/words';

CurrentRow.propTypes = {
  guess: PropTypes.string
};

export default function CurrentRow({ guess }) {
  const splitGuess = unicodeSplit(guess);
  const emptyCells = Array.from(Array(MAX_WORD_LENGTH - splitGuess.length));

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '0.5rem'
      }}
    >
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
}
