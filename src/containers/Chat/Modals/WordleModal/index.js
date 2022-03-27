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
  const { wordle: { daily } = {}, userId } = useMyState();
  const [dailyGuesses, setDailyGuesses] = useState(() => {
    if (daily?.solution !== wordleSolution) {
      return [];
    }
    return daily?.guesses;
  });
  const [gameStats, setGameStats] = useState(loadStats);
  const [statsModalShown, setStatsModalShown] = useState(false);

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
          <nav>Earn XP</nav>
          <nav className="active">{`Today's Wordle`}</nav>
          <nav>Rankings</nav>
        </FilterBar>
        <Daily
          channelId={channelId}
          gameStats={gameStats}
          guesses={dailyGuesses}
          onSetGuesses={setDailyGuesses}
          nextWordTimeStamp={nextWordTimeStamp}
          userId={userId}
          wordleSolution={wordleSolution}
          onSetStats={setGameStats}
          onSetStatsModalShown={setStatsModalShown}
        />
        {statsModalShown && (
          <StatsModal
            onHide={() => setStatsModalShown(false)}
            gameStats={gameStats}
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
