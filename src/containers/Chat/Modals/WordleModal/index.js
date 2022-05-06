import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Daily from './Daily';
import FilterBar from 'components/FilterBar';
import OverviewModal from './OverviewModal';
import Countdown from 'react-countdown';
import { css } from '@emotion/css';
import { MAX_CHALLENGES } from './constants/settings';
import { useAppContext, useChatContext } from 'contexts';

WordleModal.propTypes = {
  channelId: PropTypes.number,
  guesses: PropTypes.array,
  nextDayTimeStamp: PropTypes.number,
  solution: PropTypes.string.isRequired,
  wordLevel: PropTypes.number,
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({
  channelId,
  nextDayTimeStamp,
  guesses = [],
  solution,
  wordLevel,
  onHide
}) {
  const loadWordle = useAppContext((v) => v.requestHelpers.loadWordle);
  const onSetChannelState = useChatContext((v) => v.actions.onSetChannelState);
  const [selectedTab, setSelectedTab] = useState('daily');
  const [isRevealingDaily, setIsRevealingDaily] = useState(false);
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
          >{`Today's Word`}</nav>
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
            guesses={guesses}
            isGameOver={isDailyGameOver}
            isGameWon={isDailyGameWon}
            isGameLost={isDailyGameLost}
            nextDayTimeStamp={nextDayTimeStamp}
            solution={solution}
            onSetStatsModalShown={setDailyStatsModalShown}
          />
        )}
        {dailyStatsModalShown && (
          <OverviewModal
            solution={solution}
            wordLevel={wordLevel}
            onHide={() => setDailyStatsModalShown(false)}
          />
        )}
      </main>
      <footer>
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr'
          }}
        >
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {isDailyGameOver && selectedTab === 'daily' && !isRevealingDaily && (
              <Button
                color="blue"
                onClick={() => setDailyStatsModalShown(true)}
              >
                Show Overview
              </Button>
            )}
          </div>
          <div>
            {selectedTab === 'daily' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                  Next word in
                </p>
                <Countdown
                  key={nextDayTimeStamp}
                  className={css`
                    font-size: 1.3rem;
                  `}
                  date={nextDayTimeStamp}
                  daysInHours={true}
                  onComplete={handleCountdownComplete}
                />
              </div>
            )}
          </div>
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Button transparent onClick={onHide}>
              Close
            </Button>
          </div>
        </div>
      </footer>
    </Modal>
  );

  async function handleCountdownComplete() {
    const {
      wordleSolution,
      wordleWordLevel,
      nextDayTimeStamp: newNextDayTimeStamp
    } = await loadWordle(channelId);
    onSetChannelState({
      channelId,
      newState: {
        wordleSolution,
        wordleWordLevel,
        nextDayTimeStamp: newNextDayTimeStamp,
        wordleGuesses: []
      }
    });
  }
}
