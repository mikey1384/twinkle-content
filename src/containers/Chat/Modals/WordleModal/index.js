import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Grid from './Grid';

WordleModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({ onHide }) {
  const [guesses] = useState([]);
  const [currentGuess] = useState('');
  const [isRevealing] = useState(false);
  const [currentRowClass] = useState('');

  return (
    <Modal onHide={onHide}>
      <header>Wordle</header>
      <main>
        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          isRevealing={isRevealing}
          currentRowClassName={currentRowClass}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );
}
