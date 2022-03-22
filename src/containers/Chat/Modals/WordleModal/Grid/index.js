import React from 'react';
import PropTypes from 'prop-types';
import { MAX_CHALLENGES } from '../constants/settings';
import CompletedRow from './CompletedRow';
import CurrentRow from './CurrentRow';
import EmptyRow from './EmptyRow';
import { gridContainer } from './Styles';

Grid.propTypes = {
  guesses: PropTypes.array,
  currentGuess: PropTypes.string,
  isRevealing: PropTypes.bool,
  isWaving: PropTypes.bool,
  currentRowClassName: PropTypes.string
};

export default function Grid({
  guesses,
  currentGuess,
  isRevealing,
  isWaving,
  currentRowClassName
}) {
  const empties =
    guesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
      : [];

  return (
    <div className={gridContainer}>
      {guesses.map((guess, i) => (
        <CompletedRow
          key={i}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
          isWaving={isWaving && guesses.length - 1 === i}
        />
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentRow guess={currentGuess} className={currentRowClassName} />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
}
