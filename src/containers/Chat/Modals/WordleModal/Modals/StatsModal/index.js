import React from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import StatBar from './StatBar';
import Histogram from './Histogram';
import { css } from '@emotion/css';
import Modal from 'components/Modal';
import Button from 'components/Button';
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT
} from '../../constants/strings';

StatsModal.propTypes = {
  onHide: PropTypes.func,
  gameStats: PropTypes.object,
  nextWordTimeStamp: PropTypes.number,
  numberOfGuessesMade: PropTypes.number
};
export default function StatsModal({
  onHide,
  gameStats,
  nextWordTimeStamp,
  numberOfGuessesMade
}) {
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
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <p style={{ fontWeight: 'bold' }}>{NEW_WORD_TEXT}</p>
                <Countdown
                  className={css`
                    font-size: 1rem;
                  `}
                  date={nextWordTimeStamp}
                  daysInHours={true}
                />
              </div>
            </div>
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
