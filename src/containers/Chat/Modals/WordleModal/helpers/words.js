import { VALID_GUESSES } from '../constants/validGuesses';
import { default as GraphemeSplitter } from 'grapheme-splitter';

export const isWordInWordList = (word) => {
  return VALID_GUESSES.includes(localeAwareLowerCase(word));
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
