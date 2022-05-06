import React from 'react';
import PropTypes from 'prop-types';
import StatBar from './StatBar';
import Modal from 'components/Modal';
import Button from 'components/Button';
import AttemptResult from './AttemptResult';
import { borderRadius, Color } from 'constants/css';

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
    textColor: 'vantaBlack',
    difficultyColor: 'logoBlue',
    backgroundColor: 'white'
  },
  2: {
    label: 'elementary',
    textColor: 'vantaBlack',
    difficultyColor: 'pink',
    background: 'white'
  },
  3: {
    label: 'intermediate',
    textColor: 'vantaBlack',
    difficultyColor: 'orange',
    background: 'white'
  },
  4: {
    label: 'advanced',
    textColor: 'vantaBlack',
    difficultyColor: 'cranberry',
    background: 'white'
  },
  5: {
    label: 'epic',
    textColor: 'white',
    difficultyColor: 'gold',
    backgroundColor: 'black'
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
            flexDirection: 'column',
            padding: '0.3rem 1rem 1rem 1rem',
            borderRadius,
            boxShadow: `0 0 2px ${Color.borderGray()}`,
            border: `1px solid ${Color.borderGray()}`,
            background: Color[wordLevelObj[wordLevel].backgroundColor]()
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '2.5rem',
              textAlign: 'center',
              color: Color[wordLevelObj[wordLevel].textColor]()
            }}
          >
            {solution}
          </div>
          <div style={{ fontWeight: 'bold', lineHeight: 1 }}>
            <span style={{ color: Color[wordLevelObj[wordLevel].textColor]() }}>
              Level:{' '}
            </span>
            <span
              style={{
                color: Color[wordLevelObj[wordLevel].difficultyColor](),
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
