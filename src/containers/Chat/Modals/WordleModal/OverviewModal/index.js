import React from 'react';
import PropTypes from 'prop-types';
import StatBar from './StatBar';
import Modal from 'components/Modal';
import Button from 'components/Button';
import AttemptResult from './AttemptResult';
import { borderRadius, Color } from 'constants/css';

OverviewModal.propTypes = {
  attemptState: PropTypes.object,
  isSolved: PropTypes.bool,
  numGuesses: PropTypes.number,
  solution: PropTypes.string,
  wordLevel: PropTypes.number.isRequired,
  wordleStats: PropTypes.object,
  onHide: PropTypes.func
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
    backgroundColor: 'white'
  },
  3: {
    label: 'intermediate',
    textColor: 'vantaBlack',
    difficultyColor: 'orange',
    backgroundColor: 'white'
  },
  4: {
    label: 'advanced',
    textColor: 'vantaBlack',
    difficultyColor: 'cranberry',
    backgroundColor: 'white'
  },
  5: {
    label: 'epic',
    textColor: 'white',
    difficultyColor: 'gold',
    backgroundColor: 'black'
  }
};

export default function OverviewModal({
  attemptState,
  isSolved,
  numGuesses,
  solution,
  wordLevel,
  wordleStats,
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
          <div style={{ fontWeight: 'bold', lineHeight: 1.1 }}>
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
        <AttemptResult
          style={{ marginTop: '4rem' }}
          isSolved={isSolved}
          numGuesses={numGuesses}
          attemptState={attemptState}
        />
        <StatBar style={{ marginTop: '3.5rem' }} stats={wordleStats} />
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
