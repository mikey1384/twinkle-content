import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Game from './Game';
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
  const [selectedTab, setSelectedTab] = useState('game');
  const [isRevealing, setIsRevealing] = useState(false);
  const [statsModalShown, setStatsModalShown] = useState(false);
  const isGameWon = useMemo(
    () => guesses.includes(solution),
    [guesses, solution]
  );
  const isGameLost = useMemo(
    () => !isGameWon && guesses.length === MAX_CHALLENGES,
    [guesses.length, isGameWon]
  );
  const isGameOver = useMemo(
    () => isGameWon || isGameLost,
    [isGameLost, isGameWon]
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
            onClick={() => setSelectedTab('game')}
            className={selectedTab === 'game' ? 'active' : ''}
          >{`Today's Word`}</nav>
          <nav
            onClick={() => setSelectedTab('rankings')}
            className={selectedTab === 'rankings' ? 'active' : ''}
          >
            Rankings
          </nav>
        </FilterBar>
        {selectedTab === 'game' && (
          <Game
            isRevealing={isRevealing}
            onSetIsRevealing={setIsRevealing}
            channelId={channelId}
            guesses={guesses}
            isGameOver={isGameOver}
            isGameWon={isGameWon}
            isGameLost={isGameLost}
            nextDayTimeStamp={nextDayTimeStamp}
            solution={solution}
            onSetStatsModalShown={setStatsModalShown}
          />
        )}
        {statsModalShown && (
          <OverviewModal
            solution={solution}
            wordLevel={wordLevel}
            onHide={() => setStatsModalShown(false)}
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
            {isGameOver && selectedTab === 'game' && !isRevealing && (
              <Button
                color="blue"
                onClick={() => setStatsModalShown(true)}
                isGameWon={isGameWon}
              >
                Show Overview
              </Button>
            )}
          </div>
          <div>
            {selectedTab === 'game' && (
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
