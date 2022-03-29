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
  isGameOver: PropTypes.bool,
  isGameWon: PropTypes.bool,
  isGameLost: PropTypes.bool,
  isRevealing: PropTypes.bool,
  onSetGuesses: PropTypes.func.isRequired,
  onSetIsRevealing: PropTypes.func.isRequired,
  onSetStats: PropTypes.func.isRequired,
  onSetStatsModalShown: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  wordleSolution: PropTypes.string.isRequired
};

export default function Daily({
  channelId,
  gameStats,
  guesses,
  isGameOver,
  isGameWon,
  isGameLost,
  onSetGuesses,
  onSetStats,
  onSetStatsModalShown,
  userId,
  wordleSolution,
  isRevealing,
  onSetIsRevealing
}) {
  const mounted = useRef(true);
  const saveDailyWordleState = useAppContext(
    (v) => v.requestHelpers.saveDailyWordleState
  );
  const saveDailyWordleWinner = useAppContext(
    (v) => v.requestHelpers.saveDailyWordleWinner
  );
  const onSetWordleState = useAppContext(
    (v) => v.user.actions.onSetWordleState
  );
  const MAX_WORD_LENGTH = wordleSolution.length;
  const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;
  const [alertMessage, setAlertMessage] = useState({});
  const [isWaving, setIsWaving] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRowClass, setCurrentRowClass] = useState('');
  const isEnterReady = useMemo(
    () => !isGameOver && currentGuess.length === MAX_WORD_LENGTH,
    [MAX_WORD_LENGTH, currentGuess.length, isGameOver]
  );
  const alertMessageColor = useMemo(() => {
    if (alertMessage.status === 'error') {
      return 'rose';
    }
    if (alertMessage.status === 'fail') {
      return 'orange';
    }
    return 'green';
  }, [alertMessage.status]);

  useEffect(() => {
    mounted.current = true;
    if (isGameLost) {
      handleShowAlert({
        status: 'fail',
        message: CORRECT_WORD_MESSAGE(wordleSolution),
        options: {
          persist: true
        }
      });
    }
    return function cleanup() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          marginTop: '2rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '2rem'
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
          isEnterReady={isEnterReady}
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
    handleSaveGuess(newGuesses);
    onSetIsRevealing(true);
    setTimeout(() => {
      if (mounted.current) {
        onSetIsRevealing(false);
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
        return handleGameWon();
      }

      if (newGuesses.length === MAX_CHALLENGES) {
        onSetStats(
          addStatsForCompletedGame({
            gameStats,
            numIncorrect: newGuesses.length
          })
        );
        handleShowAlert({
          status: 'fail',
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
      await saveDailyWordleState({
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

  async function handleGameWon() {
    await saveDailyWordleWinner({ guesses, solution: wordleSolution });
    onSetStats(
      addStatsForCompletedGame({
        gameStats,
        numIncorrect: guesses.length
      })
    );
    return handleShowAlert({
      status: 'success',
      message: WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)],
      options: {
        delayMs,
        callback: () => onSetStatsModalShown(true)
      }
    });
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
          onSetIsRevealing(true);
          setIsWaving(true);
        }
        setTimeout(() => {
          if (mounted.current) {
            onSetIsRevealing(false);
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
