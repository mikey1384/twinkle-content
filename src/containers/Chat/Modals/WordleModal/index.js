import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Grid from './Grid';
import Keyboard from './Keyboard';
import Banner from 'components/Banner';
import { addStatsForCompletedGame, loadStats } from './helpers/stats';
import {
  findFirstUnusedReveal,
  isWinningWord,
  isWordInWordList,
  solution,
  unicodeLength
} from './helpers/words';
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage
} from './helpers/localStorage';
import {
  ALERT_TIME_MS,
  GAME_LOST_INFO_DELAY,
  MAX_CHALLENGES,
  MAX_WORD_LENGTH,
  REVEAL_TIME_MS
} from './constants/settings';
import {
  CORRECT_WORD_MESSAGE,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE
} from './constants/strings';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import StatsModal from './Modals/StatsModal';

WordleModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({ onHide }) {
  const [isGameWon, setIsGameWon] = useState(false);
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
  const [isGameLost, setIsGameLost] = useState(false);
  const [stats, setStats] = useState(() => loadStats());
  const alertMessageColor = useMemo(() => {
    if (alertMessage.status === 'error') {
      return 'rose';
    }
    return 'green';
  }, [alertMessage.status]);
  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution });
  }, [guesses]);
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
  }, [isGameWon, isGameLost]);

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
          />
          <Keyboard
            onChar={handleChar}
            onDelete={handleDelete}
            onEnter={handleEnter}
            guesses={guesses}
            isRevealing={isRevealing}
            style={{ marginTop: '2rem' }}
          />
          {isStatsModalOpen && (
            <StatsModal
              onHide={() => setIsStatsModalOpen(false)}
              guesses={guesses}
              gameStats={stats}
              isGameLost={isGameLost}
              isGameWon={isGameWon}
              handleShareToClipboard={() =>
                handleShowAlert({
                  status: 'success',
                  message: GAME_COPIED_MESSAGE
                })
              }
              isHardMode={isHardMode}
              numberOfGuessesMade={guesses.length}
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
      if (status === 'success') {
        setIsWaving(true);
        setTimeout(() => {
          setIsWaving(false);
        }, REVEAL_TIME_MS * MAX_WORD_LENGTH);
      }

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
