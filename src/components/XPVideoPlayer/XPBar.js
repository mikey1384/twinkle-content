import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import { rewardValue } from 'constants/defaultValues';
import { useContentState } from 'helpers/hooks';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { addCommasToNumber } from 'helpers/stringHelpers';

XPBar.propTypes = {
  alreadyEarned: PropTypes.bool,
  isChat: PropTypes.bool,
  justEarned: PropTypes.bool,
  onPlayVideo: PropTypes.func,
  rewardLevel: PropTypes.number,
  started: PropTypes.bool,
  startingPosition: PropTypes.number,
  userId: PropTypes.number,
  videoId: PropTypes.number.isRequired,
  xpLoaded: PropTypes.bool
};

export default function XPBar({
  alreadyEarned,
  isChat,
  justEarned,
  onPlayVideo,
  rewardLevel,
  started,
  startingPosition,
  userId,
  videoId,
  xpLoaded
}) {
  const earned = alreadyEarned || justEarned;
  const watching = startingPosition > 0;
  const rewardAmount = useMemo(() => rewardLevel * rewardValue, [rewardLevel]);
  const canEarnCoins = rewardAmount >= 600;
  const { xpProgress = 0 } = useContentState({
    contentType: 'video',
    contentId: videoId
  });

  const xpLevelColor = useMemo(
    () =>
      rewardLevel === 5
        ? Color.gold()
        : rewardLevel === 4
        ? Color.brownOrange()
        : rewardLevel === 3
        ? Color.orange()
        : rewardLevel === 2
        ? Color.pink()
        : Color.logoBlue(),
    [rewardLevel]
  );

  const Bar = useMemo(() => {
    if (!userId || !xpLoaded) return null;
    if (started) {
      return (
        <ProgressBar
          style={{
            marginTop: 0,
            flexGrow: 1,
            height: '2.7rem'
          }}
          progress={xpProgress}
          color={Color.green()}
          noBorderRadius
        />
      );
    } else {
      if (watching) {
        return (
          <div
            style={{
              height: '2.7rem',
              background: Color.darkBlue(),
              color: '#fff',
              flexGrow: 1,
              fontSize: '1.3rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={onPlayVideo}
          >
            Continue Watching...
          </div>
        );
      } else {
        return (
          <div
            className={css`
              height: 2.7rem;
              font-size: 1.3rem;
              @media (max-width: ${mobileMaxWidth}) {
                padding: 0.3rem;
                font-size: ${isChat ? '1rem' : '1.5rem'};
              }
            `}
            style={{
              background: earned
                ? canEarnCoins
                  ? Color.brownOrange()
                  : Color.green()
                : xpLevelColor,
              color: '#fff',
              fontWeight: 'bold',
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!earned && (
              <div>
                {[...Array(rewardLevel)].map((elem, index) => (
                  <Icon key={index} icon="star" />
                ))}
              </div>
            )}
            <div style={{ marginLeft: '0.7rem' }}>
              {earned
                ? canEarnCoins
                  ? 'Watch and earn Twinkle Coins!'
                  : 'You have earned XP from this vide'
                : `Watch and earn ${addCommasToNumber(rewardAmount)} XP`}
            </div>
          </div>
        );
      }
    }
  }, [
    canEarnCoins,
    earned,
    isChat,
    onPlayVideo,
    xpProgress,
    rewardAmount,
    rewardLevel,
    started,
    userId,
    watching,
    xpLevelColor,
    xpLoaded
  ]);

  return (
    <ErrorBoundary>
      <div
        style={{
          display: 'flex',
          marginTop: '1rem',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        {Bar}
        {started && (
          <div
            style={{
              height: '2.7rem',
              width: '13rem',
              marginLeft: '1rem',
              display: 'flex',
              fontSize: '1.3rem'
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexGrow: 1,
                fontWeight: 'bold',
                background: earned ? Color.green() : xpLevelColor
              }}
            >
              {rewardAmount} XP
              {earned && <Icon icon="check" style={{ marginLeft: '0.5rem' }} />}
            </div>
            {canEarnCoins && (
              <div
                style={{
                  height: '100%',
                  minWidth: '5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#fff',
                  background: Color.brownOrange()
                }}
              >
                <Icon size="lg" icon={['far', 'badge-dollar']} />
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
