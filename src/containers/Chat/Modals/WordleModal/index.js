import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Grid from './Grid';
import { solution } from './lib/words';
import { loadGameStateFromLocalStorage } from './lib/localStorage';
import { MAX_CHALLENGES } from './constants/settings';
import { CORRECT_WORD_MESSAGE } from './constants/strings';
import { useAlert } from './context/AlertContext';

WordleModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({ onHide }) {
  const { showError: showErrorAlert } = useAlert();
  const [guesses] = useState(handleInitGuesses);
  const [currentGuess] = useState('');
  const [isRevealing] = useState(false);
  const [currentRowClass] = useState('');
  const [, setIsGameWon] = useState(false);
  const [, setIsGameLost] = useState(false);

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
        </div>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );

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
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        persist: true
      });
    }
    return loaded.guesses;
  }
}
