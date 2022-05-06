import React from 'react';
import PropTypes from 'prop-types';
import StatBar from './StatBar';
import Modal from 'components/Modal';
import Button from 'components/Button';
import AttemptResult from './AttemptResult';
import { Color } from 'constants/css';

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
    label: 'basic',
    color: 'logoBlue'
  },
  2: {
    label: 'elementary',
    color: 'pink'
  },
  3: {
    label: 'intermediate',
    color: 'orange'
  },
  4: {
    label: 'advanced',
    color: 'rose'
  },
  5: {
    label: 'epic',
    color: 'gold'
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '2.5rem',
              textAlign: 'center'
            }}
          >
            {solution}
          </div>
          <div style={{ fontWeight: 'bold', lineHeight: 1 }}>
            <span>Level: </span>
            <span
              style={{
                color: Color[wordLevelObj[wordLevel].color](),
                textTransform: 'capitalize'
              }}
            >
              {wordLevelObj[wordLevel].label}
            </span>
          </div>
        </div>
        <AttemptResult style={{ marginTop: '3.5rem' }} isGameWon={isGameWon} />
        <StatBar style={{ marginTop: '4.5rem' }} gameStats={gameStats} />
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
