import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Game from './Game';
import OverviewModal from './OverviewModal';
import Countdown from 'react-countdown';
import { css } from '@emotion/css';
import { MAX_GUESSES } from './constants/settings';
import { useAppContext, useChatContext } from 'contexts';

WordleModal.propTypes = {
  attemptState: PropTypes.object,
  channelId: PropTypes.number,
  guesses: PropTypes.array,
  nextDayTimeStamp: PropTypes.number,
  solution: PropTypes.string,
  wordLevel: PropTypes.number,
  wordleStats: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool
};

export default function WordleModal({
  channelId,
  attemptState,
  nextDayTimeStamp,
  guesses = [],
  solution = '',
  wordLevel,
  wordleStats,
  onHide,
  socketConnected
}) {
  const loadWordle = useAppContext((v) => v.requestHelpers.loadWordle);
  const getCurrentNextDayTimeStamp = useAppContext(
    (v) => v.requestHelpers.getCurrentNextDayTimeStamp
  );
  const onSetChannelState = useChatContext((v) => v.actions.onSetChannelState);
  const [isRevealing, setIsRevealing] = useState(false);
  const [overviewModalShown, setOverviewModalShown] = useState(false);
  const isGameWon = useMemo(
    () => guesses.includes(solution),
    [guesses, solution]
  );
  const isGameLost = useMemo(
    () => !isGameWon && guesses.length === MAX_GUESSES,
    [guesses.length, isGameWon]
  );
  const isGameOver = useMemo(
    () => isGameWon || isGameLost,
    [isGameLost, isGameWon]
  );

  useEffect(() => {
    init();
    async function init() {
      const currentNextDayTimeStamp = await getCurrentNextDayTimeStamp();
      if (nextDayTimeStamp && nextDayTimeStamp !== currentNextDayTimeStamp) {
        handleCountdownComplete();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal closeWhenClickedOutside={false} onHide={onHide}>
      <header>Wordle</header>
      <main>
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
          onSetOverviewModalShown={setOverviewModalShown}
          socketConnected={socketConnected}
        />
        {overviewModalShown && (
          <OverviewModal
            numGuesses={guesses.length}
            solution={solution}
            wordLevel={wordLevel}
            wordleStats={wordleStats}
            isSolved={isGameWon}
            attemptState={attemptState}
            onHide={() => setOverviewModalShown(false)}
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
            {isGameOver && !isRevealing && (
              <Button
                color="blue"
                onClick={() => setOverviewModalShown(true)}
                isGameWon={isGameWon}
              >
                Show Overview
              </Button>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              Next Wordle
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
        attemptState: {
          isStrict: false,
          xpRewardAmount: null
        },
        wordleSolution,
        wordleWordLevel,
        nextDayTimeStamp: newNextDayTimeStamp,
        wordleGuesses: []
      }
    });
  }
}
