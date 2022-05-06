import React from 'react';
import PropTypes from 'prop-types';
import StatBar from './StatBar';
import Modal from 'components/Modal';
import Button from 'components/Button';

OverviewModal.propTypes = {
  isGameWon: PropTypes.bool,
  solution: PropTypes.string,
  wordLevel: PropTypes.number.isRequired,
  onHide: PropTypes.func
};

const gameStats = {
  totalGames: 3,
  successRate: 100,
  currentStreak: 3,
  bestStreak: 3
};

const wordLevelObj = {
  1: {
    label: 'basic'
  },
  2: {
    label: 'elementary'
  },
  3: {
    label: 'intermediate'
  },
  4: {
    label: 'advanced'
  },
  5: {
    label: 'epic'
  }
};

export default function OverviewModal({
  isGameWon,
  solution,
  wordLevel,
  onHide
}) {
  return (
    <Modal small modalOverModal onHide={onHide}>
      <header>Overview</header>
      <main>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>
            {solution}
          </span>{' '}
          ({wordLevelObj[wordLevel].label})
        </div>
        {isGameWon ? <div>won</div> : <div>lost</div>}
        <StatBar style={{ marginTop: '2rem' }} gameStats={gameStats} />
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
