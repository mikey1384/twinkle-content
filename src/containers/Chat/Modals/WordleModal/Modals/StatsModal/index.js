import React from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import StatBar from './StatBar';
import Histogram from './Histogram';
import { shareStatus } from '../../helpers/share';
import { tomorrow } from '../../helpers/words';
import { css } from '@emotion/css';
import Modal from 'components/Modal';
import Button from 'components/Button';
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT
} from '../../constants/strings';

StatsModal.propTypes = {
  onHide: PropTypes.func,
  guesses: PropTypes.array,
  gameStats: PropTypes.object,
  isGameLost: PropTypes.bool,
  isGameWon: PropTypes.bool,
  handleShareToClipboard: PropTypes.func,
  isHardMode: PropTypes.bool,
  numberOfGuessesMade: PropTypes.number
};
export default function StatsModal({
  onHide,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  isHardMode,
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
            {(isGameLost || isGameWon) && (
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
                    date={tomorrow}
                    daysInHours={true}
                  />
                </div>
                <div
                  style={{
                    marginLeft: '3rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Button
                    filled
                    color="blue"
                    onClick={() => {
                      shareStatus(
                        guesses,
                        isGameLost,
                        isHardMode,
                        handleShareToClipboard
                      );
                    }}
                  >
                    {SHARE_TEXT}
                  </Button>
                </div>
              </div>
            )}
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
