import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Grid from './Grid';
import Keyboard from './Keyboard';
import Banner from 'components/Banner';
import { addStatsForCompletedGame, loadStats } from './helpers/stats';
import {
  findFirstUnusedReveal,
  isWordInWordList,
  unicodeLength
} from './helpers/words';
import {
  ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS
} from './constants/settings';
import {
  CORRECT_WORD_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE
} from './constants/strings';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import StatsModal from './Modals/StatsModal';

WordleModal.propTypes = {
  channelId: PropTypes.number,
  nextWordTimeStamp: PropTypes.number,
  wordleSolution: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({
  channelId,
  nextWordTimeStamp,
  wordleSolution,
  onHide
}) {
  const mounted = useRef(true);
  const { wordle: { daily } = {}, userId } = useMyState();
  const MAX_WORD_LENGTH = wordleSolution.length;
  const GAME_LOST_INFO_DELAY = (MAX_WORD_LENGTH + 1) * REVEAL_TIME_MS;
  const saveWordleState = useAppContext(
    (v) => v.requestHelpers.saveWordleState
  );
  const onSetWordleState = useAppContext(
    (v) => v.user.actions.onSetWordleState
  );
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [alertMessage, setAlertMessage] = useState({});
  const [guesses, setGuesses] = useState(handleInitGuesses);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  );
  const [isRevealing, setIsRevealing] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState('');
  const [stats, setStats] = useState(() => loadStats());
  const alertMessageColor = useMemo(() => {
    if (alertMessage.status === 'error') {
      return 'rose';
    }
    return 'green';
  }, [alertMessage.status]);
  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;
      handleShowAlert({
        status: 'success',
        message: winMessage,
        options: {
          delayMs,
          onClose: () => setIsStatsModalOpen(true)
        }
      });
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, GAME_LOST_INFO_DELAY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameWon, isGameLost, MAX_WORD_LENGTH]);

  useEffect(() => {
    mounted.current = true;
    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  return (
    <Modal onHide={onHide}>
      <header>Wordle</header>
      <main>
        {alertMessage.shown && (
          <Banner style={{ marginBottom: '2rem' }} color={alertMessageColor}>
            {alertMessage.message}
          </Banner>
        )}
        <div
          style={{
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
          {isStatsModalOpen && (
            <StatsModal
              onHide={() => setIsStatsModalOpen(false)}
              guesses={guesses}
              gameStats={stats}
              isGameLost={isGameLost}
              isGameWon={isGameWon}
              isHardMode={isHardMode}
              nextWordTimeStamp={nextWordTimeStamp}
              numberOfGuessesMade={guesses.length}
              solution={wordleSolution}
            />
          )}
        </div>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Close
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
            onClose: () => setCurrentRowClass('')
          }
        });
      }
    }

    setIsRevealing(true);
    // turn this back off after all
    // chars have been revealed
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
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === wordleSolution) {
        setStats(addStatsForCompletedGame(stats, guesses.length));
        return setIsGameWon(true);
      }

      if (newGuesses.length === MAX_CHALLENGES) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1));
        setIsGameLost(true);
        handleShowAlert({
          status: 'error',
          message: CORRECT_WORD_MESSAGE(wordleSolution),
          options: {
            persist: true,
            delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1
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
      onClose,
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

      if (!persist) {
        setTimeout(() => {
          if (mounted.current) {
            setAlertMessage({ shown: false, status: '', message: '' });
          }
          if (onClose) {
            onClose();
          }
        }, durationMs);
      }
    }, delayMs);
  }

  function handleInitGuesses() {
    if (daily?.solution !== wordleSolution) {
      return [];
    }
    const gameWasWon = daily?.guesses.includes(wordleSolution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (daily?.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true);
      handleShowAlert({
        status: 'error',
        message: CORRECT_WORD_MESSAGE(wordleSolution),
        options: {
          persist: true
        }
      });
    }
    return daily?.guesses;
  }
}
