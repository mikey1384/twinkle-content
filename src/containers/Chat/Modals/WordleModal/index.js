import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Daily from './Daily';
import FilterBar from 'components/FilterBar';
import StatsModal from './Modals/StatsModal';
import { useMyState } from 'helpers/hooks';
import { loadStats } from './helpers/stats';

WordleModal.propTypes = {
  channelId: PropTypes.number,
  nextWordTimeStamp: PropTypes.number,
  wordleSolution: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({
  channelId,
  nextWordTimeStamp,
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
  const [dailyGameStats, setDailyGameStats] = useState(loadStats);
  const [dailyStatsModalShown, setDailyStatsModalShown] = useState(false);

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
            channelId={channelId}
            gameStats={dailyGameStats}
            guesses={dailyGuesses}
            onSetGuesses={setDailyGuesses}
            nextWordTimeStamp={nextWordTimeStamp}
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
            nextWordTimeStamp={nextWordTimeStamp}
            numberOfGuessesMade={dailyGuesses.length}
          />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
