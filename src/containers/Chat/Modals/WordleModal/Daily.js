import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Grid from './Grid';
import Keyboard from './Keyboard';
import Banner from 'components/Banner';
import { addStatsForCompletedGame } from './helpers/stats';
import {
  ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS
} from './constants/settings';
import {
  findFirstUnusedReveal,
  isWordInWordList,
  unicodeLength
} from './helpers/words';
import {
  CORRECT_WORD_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE
} from './constants/strings';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import { useAppContext } from 'contexts';

Daily.propTypes = {
  channelId: PropTypes.number.isRequired,
  gameStats: PropTypes.object.isRequired,
  guesses: PropTypes.array.isRequired,
  isGameWon: PropTypes.bool,
  isGameLost: PropTypes.bool,
  onSetGuesses: PropTypes.func.isRequired,
  onSetStats: PropTypes.func.isRequired,
  onSetStatsModalShown: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  wordleSolution: PropTypes.string.isRequired
};

export default function Daily({
  channelId,
  gameStats,
  guesses,
  isGameWon,
  isGameLost,
  onSetGuesses,
  onSetStats,
  onSetStatsModalShown,
  userId,
  wordleSolution
}) {
  const mounted = useRef(true);
  const saveWordleState = useAppContext(
    (v) => v.requestHelpers.saveWordleState
  );
  const onSetWordleState = useAppContext(
    (v) => v.user.actions.onSetWordleState
  );
  const MAX_WORD_LENGTH = wordleSolution.length;
  const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;
  const [alertMessage, setAlertMessage] = useState({});
  const [isRevealing, setIsRevealing] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRowClass, setCurrentRowClass] = useState('');
  const alertMessageColor = useMemo(() => {
    if (alertMessage.status === 'error') {
      return 'rose';
    }
    return 'green';
  }, [alertMessage.status]);

  useEffect(() => {
    mounted.current = true;
    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  const [isHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  );

  return (
    <ErrorBoundary>
      {alertMessage.shown && (
        <Banner style={{ marginTop: '1rem' }} color={alertMessageColor}>
          {alertMessage.message}
        </Banner>
      )}
      <div
        style={{
          marginTop: '2.5rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          isRevealing={isRevealing}
          isWaving={isWaving}
          currentRowClassName={currentRowClass}
          maxWordLength={MAX_WORD_LENGTH}
          solution={wordleSolution}
        />
        <Keyboard
          onChar={handleChar}
          onDelete={handleDelete}
          onEnter={handleEnter}
          guesses={guesses}
          isRevealing={isRevealing}
          maxWordLength={MAX_WORD_LENGTH}
          solution={wordleSolution}
          style={{ marginTop: '2rem' }}
        />
      </div>
    </ErrorBoundary>
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

  async function handleEnter() {
    const newGuesses = guesses.concat(currentGuess);
    handleSaveGuess(newGuesses);
    if (isGameWon || isGameLost) {
      return;
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle');
      return handleShowAlert({
        status: 'error',
        message: NOT_ENOUGH_LETTERS_MESSAGE,
        options: {
          callback: () => setCurrentRowClass('')
        }
      });
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle');
      return handleShowAlert({
        status: 'error',
        message: WORD_NOT_FOUND_MESSAGE,
        options: {
          callback: () => setCurrentRowClass('')
        }
      });
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal({
        word: currentGuess,
        guesses,
        solution: wordleSolution
      });
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle');
        return handleShowAlert({
          status: 'error',
          message: firstMissingReveal,
          options: {
            callback: () => setCurrentRowClass('')
          }
        });
      }
    }

    setIsRevealing(true);
    setTimeout(() => {
      if (mounted.current) {
        setIsRevealing(false);
      }
    }, REVEAL_TIME_MS * MAX_WORD_LENGTH);

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      onSetGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === wordleSolution) {
        onSetStats(
          addStatsForCompletedGame({
            gameStats,
            numIncorrect: guesses.length
          })
        );
        return handleShowAlert({
          status: 'success',
          message:
            WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)],
          options: {
            delayMs,
            callback: () => onSetStatsModalShown(true)
          }
        });
      }

      if (newGuesses.length === MAX_CHALLENGES) {
        onSetStats(
          addStatsForCompletedGame({
            gameStats,
            numIncorrect: newGuesses.length
          })
        );
        handleShowAlert({
          status: 'error',
          message: CORRECT_WORD_MESSAGE(wordleSolution),
          options: {
            persist: true,
            delayMs,
            callback: () => onSetStatsModalShown(true)
          }
        });
      }
    }

    async function handleSaveGuess(newGuesses) {
      await saveWordleState({
        channelId,
        guesses: newGuesses,
        solution: wordleSolution
      });
      if (mounted.current) {
        onSetWordleState({
          userId,
          newState: { daily: { guesses: newGuesses, solution: wordleSolution } }
        });
      }
    }
  }

  function handleShowAlert({ status, message, options }) {
    const {
      delayMs = 0,
      persist,
      callback,
      durationMs = ALERT_TIME_MS
    } = options || {};
    setTimeout(() => {
      if (mounted.current) {
        setAlertMessage({ shown: true, status, message });
      }
      if (status === 'success') {
        if (mounted.current) {
          setIsWaving(true);
        }
        setTimeout(() => {
          if (mounted.current) {
            setIsWaving(false);
          }
        }, REVEAL_TIME_MS * MAX_WORD_LENGTH);
      }
      setTimeout(() => {
        if (!persist && mounted.current) {
          setAlertMessage({ shown: false, status: '', message: '' });
        }
        if (callback) {
          callback();
        }
      }, durationMs);
    }, delayMs);
  }
}