import { VALID_GUESSES } from '../constants/validGuesses';
import {
  WRONG_SPOT_MESSAGE,
  NOT_CONTAINED_MESSAGE
} from '../constants/strings';
import { getGuessStatuses } from './statuses';
import { default as GraphemeSplitter } from 'grapheme-splitter';

export const isWordInWordList = (word) => {
  return VALID_GUESSES.includes(localeAwareLowerCase(word));
};

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = ({ word, guesses, solution }) => {
  if (guesses.length === 0) {
    return false;
  }

  const lettersLeftArray = [];
  const guess = guesses[guesses.length - 1];
  const statuses = getGuessStatuses({ guess, solution });
  const splitWord = unicodeSplit(word);
  const splitGuess = unicodeSplit(guess);

  for (let i = 0; i < splitGuess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(splitGuess[i]);
    }
    if (statuses[i] === 'correct' && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1);
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n;
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter);
    if (n !== -1) {
      lettersLeftArray.splice(n, 1);
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0]);
  }
  return false;
};

export const unicodeSplit = (word) => {
  return new GraphemeSplitter().splitGraphemes(word);
};

export const unicodeLength = (word) => {
  return unicodeSplit(word).length;
};

export const localeAwareLowerCase = (text) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase();
};

export const localeAwareUpperCase = (text) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase();
};
