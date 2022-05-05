import React from 'react';
import PropTypes from 'prop-types';
import StatBar from './StatBar';
import Histogram from './Histogram';
import Modal from 'components/Modal';
import Button from 'components/Button';
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT
} from '../constants/strings';

StatsModal.propTypes = {
  onHide: PropTypes.func,
  gameStats: PropTypes.object,
  numberOfGuessesMade: PropTypes.number
};

export default function StatsModal({ onHide, gameStats, numberOfGuessesMade }) {
  return (
    <Modal small modalOverModal onHide={onHide}>
      <header>{STATISTICS_TITLE}</header>
      <main>
        {gameStats.totalGames <= 0 ? (
          <StatBar gameStats={gameStats} />
        ) : (
          <>
            <StatBar gameStats={gameStats} />
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '1.7rem',
                marginTop: '1.5rem'
              }}
            >
              {GUESS_DISTRIBUTION_TEXT}
            </p>
            <Histogram
              gameStats={gameStats}
              numberOfGuessesMade={numberOfGuessesMade}
            />
          </>
        )}
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
