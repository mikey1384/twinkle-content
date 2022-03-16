import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Grid from './Grid';
import Keyboard from './Keyboard';
import { addStatsForCompletedGame, loadStats } from './lib/stats';
import {
  findFirstUnusedReveal,
  isWinningWord,
  isWordInWordList,
  solution,
  unicodeLength
} from './lib/words';
import { loadGameStateFromLocalStorage } from './lib/localStorage';
import {
  ALERT_TIME_MS,
  MAX_CHALLENGES,
  MAX_WORD_LENGTH,
  REVEAL_TIME_MS
} from './constants/settings';
import {
  CORRECT_WORD_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE
} from './constants/strings';
import { default as GraphemeSplitter } from 'grapheme-splitter';

WordleModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({ onHide }) {
  const [, setAlertMessage] = useState(null);
  const [guesses, setGuesses] = useState(handleInitGuesses);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  );
  const [isRevealing, setIsRevealing] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState('');
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [stats, setStats] = useState(() => loadStats());

  return (
    <Modal onHide={onHide}>
      <header>Wordle</header>
      <main>
        <div
          style={{
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <Grid
              guesses={guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
          </div>
          <Keyboard
            onChar={handleChar}
            onDelete={handleDelete}
            onEnter={handleEnter}
            guesses={guesses}
            isRevealing={isRevealing}
          />
        </div>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );

  function handleChar(value) {
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  }

  function handleDelete() {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    );
  }

  function handleEnter() {
    if (isGameWon || isGameLost) {
      return;
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle');
      return handleShowAlert({
        status: 'error',
        message: NOT_ENOUGH_LETTERS_MESSAGE,
        options: {
          onClose: () => setCurrentRowClass('')
        }
      });
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle');
      return handleShowAlert({
        status: 'error',
        message: WORD_NOT_FOUND_MESSAGE,
        options: {
          onClose: () => setCurrentRowClass('')
        }
      });
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses);
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle');
        return handleShowAlert({
          status: 'error',
          message: firstMissingReveal,
          options: {
            onClose: () => setCurrentRowClass('')
          }
        });
      }
    }

    setIsRevealing(true);
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false);
    }, REVEAL_TIME_MS * MAX_WORD_LENGTH);

    const winningWord = isWinningWord(currentGuess);

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess('');

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length));
        return setIsGameWon(true);
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1));
        setIsGameLost(true);
        handleShowAlert({
          status: 'error',
          message: CORRECT_WORD_MESSAGE(solution),
          options: {
            persist: true,
            delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1
          }
        });
      }
    }
  }

  function handleShowAlert({ status, message, options }) {
    const {
      delayMs = 0,
      persist,
      onClose,
      durationMs = ALERT_TIME_MS
    } = options || {};
    setTimeout(() => {
      setAlertMessage({ shown: true, status, message });

      if (!persist) {
        setTimeout(() => {
          setAlertMessage({ shown: false, status: '', message: '' });
          if (onClose) {
            onClose();
          }
        }, durationMs);
      }
    }, delayMs);
  }

  function handleInitGuesses() {
    const loaded = loadGameStateFromLocalStorage();
    if (loaded?.solution !== solution) {
      return [];
    }
    const gameWasWon = loaded.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true);
      handleShowAlert({
        status: 'error',
        message: CORRECT_WORD_MESSAGE(solution),
        options: {
          persist: true
        }
      });
    }
    return loaded.guesses;
  }
}
