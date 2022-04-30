import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Daily from './Daily';
import FilterBar from 'components/FilterBar';
import StatsModal from './Modals/StatsModal';
import Countdown from 'react-countdown';
import { css } from '@emotion/css';
import { MAX_CHALLENGES } from './constants/settings';
import { loadStats } from './helpers/stats';
import { NEW_WORD_TEXT } from './constants/strings';

WordleModal.propTypes = {
  channelId: PropTypes.number,
  guesses: PropTypes.array,
  nextDayTimeStamp: PropTypes.number,
  solution: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({
  channelId,
  nextDayTimeStamp,
  guesses = [],
  solution,
  onHide
}) {
  const [selectedTab, setSelectedTab] = useState('daily');
  const [isRevealingDaily, setIsRevealingDaily] = useState(false);
  const [dailyGameStats, setDailyGameStats] = useState(loadStats);
  const [dailyStatsModalShown, setDailyStatsModalShown] = useState(false);
  const isDailyGameWon = useMemo(
    () => guesses.includes(solution),
    [guesses, solution]
  );
  const isDailyGameLost = useMemo(
    () => !isDailyGameWon && guesses.length === MAX_CHALLENGES,
    [guesses.length, isDailyGameWon]
  );
  const isDailyGameOver = useMemo(
    () => isDailyGameWon || isDailyGameLost,
    [isDailyGameLost, isDailyGameWon]
  );

  return (
    <Modal onHide={onHide}>
      <header>Wordle</header>
      <main>
        <FilterBar
          style={{
            marginTop: '-2rem',
            fontSize: '1.5rem',
            height: '5rem'
          }}
        >
          <nav
            onClick={() => setSelectedTab('daily')}
            className={selectedTab === 'daily' ? 'active' : ''}
          >{`Today's Wordle`}</nav>
          <nav
            onClick={() => setSelectedTab('rankings')}
            className={selectedTab === 'rankings' ? 'active' : ''}
          >
            Rankings
          </nav>
        </FilterBar>
        {selectedTab === 'daily' && (
          <Daily
            isRevealing={isRevealingDaily}
            onSetIsRevealing={setIsRevealingDaily}
            channelId={channelId}
            gameStats={dailyGameStats}
            guesses={guesses}
            isGameOver={isDailyGameOver}
            isGameWon={isDailyGameWon}
            isGameLost={isDailyGameLost}
            nextDayTimeStamp={nextDayTimeStamp}
            solution={solution}
            onSetStats={setDailyGameStats}
            onSetStatsModalShown={setDailyStatsModalShown}
          />
        )}
        {dailyStatsModalShown && (
          <StatsModal
            onHide={() => setDailyStatsModalShown(false)}
            gameStats={dailyGameStats}
            nextDayTimeStamp={nextDayTimeStamp}
            numberOfGuessesMade={guesses.length}
          />
        )}
      </main>
      <footer>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent:
              isDailyGameOver && selectedTab === 'daily' && !isRevealingDaily
                ? 'space-around'
                : 'flex-end'
          }}
        >
          {isDailyGameOver && selectedTab === 'daily' && !isRevealingDaily && (
            <Button color="blue" onClick={() => setDailyStatsModalShown(true)}>
              Show Stats
            </Button>
          )}
          {isDailyGameOver && selectedTab === 'daily' && !isRevealingDaily && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                {NEW_WORD_TEXT}
              </p>
              <Countdown
                className={css`
                  font-size: 1.3rem;
                `}
                date={nextDayTimeStamp}
                daysInHours={true}
              />
            </div>
          )}
          <Button transparent onClick={onHide}>
            Close
          </Button>
        </div>
      </footer>
    </Modal>
  );
}
