import { getGuessStatuses } from './statuses';
import { unicodeSplit } from './words';
import { MAX_CHALLENGES } from '../constants/settings';
import { UAParser } from 'ua-parser-js';

const webShareApiDeviceTypes = ['mobile', 'smarttv', 'wearable'];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

export const shareStatus = ({
  guesses,
  isGameLost,
  isHardMode,
  handleShareToClipboard,
  solution
}) => {
  const textToShare =
    `Wordle ${isGameLost ? 'X' : guesses.length}/${MAX_CHALLENGES}${
      isHardMode ? '*' : ''
    }\n\n` +
    generateEmojiGrid({
      guesses,
      tiles: ['🟩', '🟨', '⬛'],
      solution
    });

  const shareData = { text: textToShare };

  let shareSuccess = false;

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData);
      shareSuccess = true;
    }
  } catch (error) {
    shareSuccess = false;
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare);
    handleShareToClipboard();
  }
};

export const generateEmojiGrid = ({ guesses, tiles, solution }) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses({ guess, solution });
      const splitGuess = unicodeSplit(guess);

      return splitGuess
        .map((_, i) => {
          switch (status[i]) {
            case 'correct':
              return tiles[0];
            case 'present':
              return tiles[1];
            default:
              return tiles[2];
          }
        })
        .join('');
    })
    .join('\n');
};

const attemptShare = (shareData) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  );
};
