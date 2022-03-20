import React from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import StatBar from './StatBar';
import Histogram from './Histogram';
import { shareStatus } from '../../lib/share';
import { tomorrow } from '../../lib/words';
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
            <h4 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              {GUESS_DISTRIBUTION_TEXT}
            </h4>
            <Histogram
              gameStats={gameStats}
              numberOfGuessesMade={numberOfGuessesMade}
            />
            {(isGameLost || isGameWon) && (
              <div className="mt-5 sm:mt-6 columns-2 dark:text-white">
                <div>
                  <h5>{NEW_WORD_TEXT}</h5>
                  <Countdown
                    className="text-lg font-medium text-gray-900 dark:text-gray-100"
                    date={tomorrow}
                    daysInHours={true}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
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
                </button>
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
