import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import { REWARD_VALUE } from 'constants/defaultValues';
import { useContentState } from 'helpers/hooks';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
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
  const xpEarned = alreadyEarned || justEarned;
  const watching = startingPosition > 0;
  const rewardAmount = useMemo(() => rewardLevel * REWARD_VALUE, [rewardLevel]);
  const canEarnCoins = rewardLevel >= 3;
  const {
    coinProgress = 0,
    xpProgress = 0,
    numCoinsEarned = 0
  } = useContentState({
    contentType: 'video',
    contentId: videoId
  });

  const xpLevelColor = useMemo(
    () =>
      rewardLevel === 5
        ? Color.gold()
        : rewardLevel === 4
        ? Color.cranberry()
        : rewardLevel === 3
        ? Color.orange()
        : rewardLevel === 2
        ? Color.pink()
        : Color.logoBlue(),
    [rewardLevel]
  );

  const Bar = useMemo(() => {
    if (!userId || !xpLoaded || (!(watching && !started) && !rewardLevel)) {
      return null;
    }
    if (started && !(xpEarned && !canEarnCoins)) {
      return (
        <ProgressBar
          className={css`
            margin-top: 0;
            flex-grow: 1;
            height: 2.7rem !important;
            margin-top: 0 !important;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: ${isChat ? '1rem' : '1.2rem'};
              height: ${isChat ? '2rem' : '2.7rem'} !important;
              font-size: ${isChat ? '0.8rem' : '1.2rem'}!important;
            }
          `}
          progress={xpEarned ? coinProgress : xpProgress}
          color={xpEarned ? Color.brownOrange() : xpLevelColor}
          noBorderRadius
        />
      );
    } else {
      if (watching && !started) {
        return (
          <div
            className={css`
              height: 2.7rem;
              background: ${Color.darkBlue()};
              color: #fff;
              flex-grow: 1;
              font-size: 1.3rem;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              @media (max-width: ${mobileMaxWidth}) {
                height: ${isChat ? '2rem' : '2.7rem'};
                font-size: ${isChat ? '1rem' : '1.3rem'};
              }
            `}
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
                height: ${isChat ? '2rem' : '2.7rem'};
                font-size: ${isChat ? '1rem' : '1.3rem'};
              }
            `}
            style={{
              background: xpEarned
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
            {!xpEarned && (
              <div>
                {[...Array(rewardLevel)].map((elem, index) => (
                  <Icon key={index} icon="star" />
                ))}
              </div>
            )}
            {xpEarned && canEarnCoins && (
              <div>
                <Icon icon={['far', 'badge-dollar']} />
              </div>
            )}
            <div style={{ marginLeft: '0.7rem' }}>
              {xpEarned
                ? canEarnCoins
                  ? 'Watch and earn Twinkle Coins!'
                  : `You have earned ${
                      justEarned ? rewardAmount : ''
                    } XP from this video`
                : `Watch and earn ${addCommasToNumber(rewardAmount)} XP!`}
            </div>
          </div>
        );
      }
    }
  }, [
    userId,
    xpLoaded,
    started,
    xpEarned,
    canEarnCoins,
    coinProgress,
    xpProgress,
    xpLevelColor,
    watching,
    onPlayVideo,
    isChat,
    rewardLevel,
    justEarned,
    rewardAmount
  ]);

  return userId && xpLoaded ? (
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
        {started && !(xpEarned && !canEarnCoins) && !!rewardLevel && (
          <div
            className={css`
              height: 2.7rem;
              width: ${canEarnCoins ? '13rem' : '7rem'};
              margin-left: 1rem;
              display: flex;
              font-size: 1.3rem;
              @media (max-width: ${mobileMaxWidth}) {
                width: ${isChat
                  ? canEarnCoins
                    ? '8rem'
                    : '4rem'
                  : canEarnCoins
                  ? '13rem'
                  : '7rem'};
                height: ${isChat ? '2rem' : '2.7rem'};
                font-size: ${isChat ? '0.8rem' : '1.3rem'};
              }
            `}
          >
            <div
              className={css`
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                flex-grow: 1;
                font-weight: bold;
                background: ${xpEarned ? Color.green() : xpLevelColor};
              `}
            >
              {rewardAmount} XP
              {xpEarned && (
                <Icon icon="check" style={{ marginLeft: '0.5rem' }} />
              )}
            </div>
            {canEarnCoins && (
              <div
                className={css`
                  height: 100%;
                  min-width: 5rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  color: #fff;
                  font-size: 1.5rem;
                  background: ${Color.brownOrange()};
                  @media (max-width: ${mobileMaxWidth}) {
                    min-width: ${isChat ? '3rem' : '5rem'};
                    font-size: ${isChat ? '0.8rem' : '1.5rem'};
                  }
                `}
              >
                {numCoinsEarned > 0 ? (
                  `+ ${numCoinsEarned}`
                ) : (
                  <Icon size="lg" icon={['far', 'badge-dollar']} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  ) : null;
}
