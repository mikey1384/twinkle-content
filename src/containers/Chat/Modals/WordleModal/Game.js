import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Grid from './Grid';
import Keyboard from './Keyboard';
import Banner from 'components/Banner';
import {
  ALERT_TIME_MS,
  MAX_GUESSES,
  REVEAL_TIME_MS
} from './constants/settings';
import { isWordInWordList, unicodeLength } from './helpers/words';
import {
  CORRECT_WORD_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE
} from './constants/strings';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import { useAppContext, useChatContext } from 'contexts';

Daily.propTypes = {
  channelId: PropTypes.number.isRequired,
  guesses: PropTypes.array.isRequired,
  isGameOver: PropTypes.bool,
  isGameWon: PropTypes.bool,
  isGameLost: PropTypes.bool,
  isRevealing: PropTypes.bool,
  onSetIsRevealing: PropTypes.func.isRequired,
  onSetStatsModalShown: PropTypes.func.isRequired,
  solution: PropTypes.string.isRequired
};

export default function Daily({
  channelId,
  guesses,
  isGameOver,
  isGameWon,
  isGameLost,
  onSetStatsModalShown,
  solution,
  isRevealing,
  onSetIsRevealing
}) {
  const mounted = useRef(true);
  const updateWordleAttempt = useAppContext(
    (v) => v.requestHelpers.updateWordleAttempt
  );
  const onSetWordleGuesses = useChatContext(
    (v) => v.actions.onSetWordleGuesses
  );
  const MAX_WORD_LENGTH = solution.length;
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
        message: CORRECT_WORD_MESSAGE(solution),
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
          solution={solution}
        />
        <Keyboard
          onChar={handleChar}
          onDelete={handleDelete}
          onEnter={handleEnter}
          guesses={guesses}
          isRevealing={isRevealing}
          maxWordLength={MAX_WORD_LENGTH}
          solution={solution}
          isEnterReady={isEnterReady}
          style={{ marginTop: '2rem' }}
        />
      </div>
    </ErrorBoundary>
  );

  function handleChar(value) {
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_GUESSES &&
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

    if (newGuesses.length < MAX_GUESSES) {
      updateWordleAttempt({
        channelId,
        guesses: newGuesses,
        solution
      });
    }
    if (mounted.current) {
      setCurrentGuess('');
    }
    if (mounted.current) {
      onSetWordleGuesses({
        channelId,
        guesses: newGuesses
      });
    }
    onSetIsRevealing(true);
    setTimeout(() => {
      if (mounted.current) {
        onSetIsRevealing(false);
      }
    }, REVEAL_TIME_MS * MAX_WORD_LENGTH);

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_GUESSES &&
      !isGameWon
    ) {
      if (currentGuess === solution) {
        return handleGameWon();
      }

      if (newGuesses.length === MAX_GUESSES) {
        handleGameLost();
      }
    }

    async function handleGameLost() {
      await updateWordleAttempt({
        channelId,
        guesses: guesses.concat(currentGuess),
        solution,
        isSolved: false
      });
      handleShowAlert({
        status: 'fail',
        message: CORRECT_WORD_MESSAGE(solution),
        options: {
          persist: true,
          delayMs,
          callback: () => onSetStatsModalShown(true)
        }
      });
    }

    async function handleGameWon() {
      await updateWordleAttempt({
        channelId,
        guesses: guesses.concat(currentGuess),
        solution,
        isSolved: true
      });
      return handleShowAlert({
        status: 'success',
        message: WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)],
        options: {
          delayMs,
          callback: () => onSetStatsModalShown(true)
        }
      });
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
