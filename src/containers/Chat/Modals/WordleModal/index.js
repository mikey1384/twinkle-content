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
import { useMyState } from 'helpers/hooks';
import { loadStats } from './helpers/stats';
import { NEW_WORD_TEXT } from './constants/strings';

WordleModal.propTypes = {
  channelId: PropTypes.number,
  nextDayTimeStamp: PropTypes.number,
  wordleSolution: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({
  channelId,
  nextDayTimeStamp,
  wordleSolution,
  onHide
}) {
  const [selectedTab, setSelectedTab] = useState('daily');
  const { wordle: { daily } = {}, userId } = useMyState();
  const [dailyGuesses, setDailyGuesses] = useState(() => {
    if (daily?.solution !== wordleSolution) {
      return [];
    }
    return daily?.guesses;
  });
  const [isRevealingDaily, setIsRevealingDaily] = useState(false);
  const [dailyGameStats, setDailyGameStats] = useState(loadStats);
  const [dailyStatsModalShown, setDailyStatsModalShown] = useState(false);
  const isDailyGameWon = useMemo(
    () => dailyGuesses.includes(wordleSolution),
    [dailyGuesses, wordleSolution]
  );
  const isDailyGameLost = useMemo(
    () => !isDailyGameWon && dailyGuesses.length === MAX_CHALLENGES,
    [dailyGuesses.length, isDailyGameWon]
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
            onClick={() => setSelectedTab('earn')}
            className={selectedTab === 'earn' ? 'active' : ''}
          >
            Earn XP
          </nav>
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
            guesses={dailyGuesses}
            isGameOver={isDailyGameOver}
            isGameWon={isDailyGameWon}
            isGameLost={isDailyGameLost}
            onSetGuesses={setDailyGuesses}
            nextDayTimeStamp={nextDayTimeStamp}
            userId={userId}
            wordleSolution={wordleSolution}
            onSetStats={setDailyGameStats}
            onSetStatsModalShown={setDailyStatsModalShown}
          />
        )}
        {dailyStatsModalShown && (
          <StatsModal
            onHide={() => setDailyStatsModalShown(false)}
            gameStats={dailyGameStats}
            nextDayTimeStamp={nextDayTimeStamp}
            numberOfGuessesMade={dailyGuesses.length}
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
