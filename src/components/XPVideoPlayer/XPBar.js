import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import FullTextReveal from 'components/Texts/FullTextReveal';
import { videoRewardHash } from 'constants/defaultValues';
import { useContentState, useMyState } from 'helpers/hooks';
import { isMobile } from 'helpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { addCommasToNumber } from 'helpers/stringHelpers';

XPBar.propTypes = {
  isChat: PropTypes.bool,
  rewardLevel: PropTypes.number,
  started: PropTypes.bool,
  startingPosition: PropTypes.number,
  userId: PropTypes.number,
  videoId: PropTypes.number.isRequired
};

const isViewingOnMobile = isMobile(navigator);

export default function XPBar({
  isChat,
  rewardLevel,
  started,
  startingPosition,
  userId,
  videoId
}) {
  const [hovered, setHovered] = useState(false);
  const watching = startingPosition > 0;
  const { rewardBoostLvl, twinkleCoins } = useMyState();
  const xpRewardAmount = useMemo(
    () => rewardLevel * (videoRewardHash?.[rewardBoostLvl]?.xp || 20),
    [rewardBoostLvl, rewardLevel]
  );
  const coinRewardAmount = useMemo(
    () => videoRewardHash?.[rewardBoostLvl]?.coin || 2,
    [rewardBoostLvl]
  );
  const canEarnCoins = rewardLevel >= 3;
  const {
    videoProgress = 0,
    numCoinsEarned = 0,
    numXpEarned = 0
  } = useContentState({
    contentType: 'video',
    contentId: videoId
  });

  const numXpEarnedWithComma = useMemo(() => addCommasToNumber(numXpEarned), [
    numXpEarned
  ]);
  const numCoinsEarnedWithComma = useMemo(
    () => addCommasToNumber(numCoinsEarned),
    [numCoinsEarned]
  );

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

  const continuingStatusShown = useMemo(() => watching && !started, [
    started,
    watching
  ]);

  const Bar = useMemo(() => {
    if (!userId || !rewardLevel) {
      return null;
    }
    if (started) {
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
          progress={videoProgress}
          color={xpLevelColor}
          noBorderRadius
        />
      );
    } else {
      return (
        <div
          className={css`
            height: 2.7rem;
            font-size: 1.3rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1rem;
              height: ${isChat ? '2rem' : '2.7rem'};
            }
          `}
          style={{
            background: continuingStatusShown ? Color.darkBlue() : xpLevelColor,
            color: '#fff',
            fontWeight: 'bold',
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ marginLeft: '0.7rem' }}>
            {continuingStatusShown && <span>Continue watching (</span>}
            <span>{addCommasToNumber(xpRewardAmount)} XP</span>
            {rewardLevel > 2 ? (
              <>
                {' '}
                <span>&</span>
                <Icon
                  style={{ marginLeft: '0.5rem' }}
                  icon={['far', 'badge-dollar']}
                />
                <span style={{ marginLeft: '0.2rem' }}>{coinRewardAmount}</span>
              </>
            ) : (
              ''
            )}
            {continuingStatusShown ? <span>)</span> : <span> per minute</span>}
          </div>
        </div>
      );
    }
  }, [
    continuingStatusShown,
    userId,
    started,
    rewardLevel,
    isChat,
    videoProgress,
    xpLevelColor,
    xpRewardAmount,
    coinRewardAmount
  ]);

  const Stars = useMemo(
    () =>
      [...Array(rewardLevel)].map((elem, index) => (
        <Icon key={index} style={{ verticalAlign: 0 }} icon="star" />
      )),
    [rewardLevel]
  );

  return userId ? (
    <ErrorBoundary>
      <div
        className={css`
          display: flex;
          margin-top: 1rem;
          align-items: center;
          width: 100%;
          justify-content: space-between;
        `}
      >
        {Bar}
        {!!rewardLevel && (
          <div
            className={css`
              height: 2.7rem;
              min-width: ${canEarnCoins ? `1${rewardLevel - 1}rem` : '7rem'};
              margin-left: 1rem;
              display: flex;
              @media (max-width: ${mobileMaxWidth}) {
                min-width: 0;
                max-width: 8.5rem;
                height: ${isChat ? '2rem' : '2.7rem'};
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
                background: ${xpLevelColor};
                font-size: 1.3rem;
                @media (max-width: ${mobileMaxWidth}) {
                  flex-grow: 0;
                  width: 5rem;
                  font-size: ${numXpEarned > 0 ? '0.7rem' : '1rem'};
                }
              `}
            >
              {numXpEarned > 0
                ? `+ ${numXpEarnedWithComma}`
                : isViewingOnMobile
                ? `${rewardLevel}-STAR`
                : Stars}
            </div>
            {canEarnCoins && (
              <div>
                <div
                  onClick={() =>
                    isViewingOnMobile ? setHovered((hovered) => !hovered) : {}
                  }
                  onMouseEnter={
                    twinkleCoins > 1000 ? () => setHovered(true) : () => {}
                  }
                  onMouseLeave={() => setHovered(false)}
                  className={css`
                    height: 100%;
                    position: relative;
                    min-width: 5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #fff;
                    font-size: ${numCoinsEarned > 0 ? '1.3rem' : '1.5rem'};
                    background: ${Color.brownOrange(
                      twinkleCoins > 1000 ? 0.3 : 1
                    )};
                    @media (max-width: ${mobileMaxWidth}) {
                      flex-grow: 1;
                      min-width: 3.5rem;
                      font-size: ${numCoinsEarned > 0 && twinkleCoins <= 1000
                        ? '0.7rem'
                        : '1.2rem'};
                    }
                  `}
                >
                  {numCoinsEarned > 0 && twinkleCoins <= 1000 ? (
                    `+ ${numCoinsEarnedWithComma}`
                  ) : (
                    <Icon size="lg" icon={['far', 'badge-dollar']} />
                  )}
                </div>
                {hovered && (
                  <FullTextReveal
                    show
                    direction="left"
                    style={{
                      marginTop: '0.5rem',
                      color: '#000',
                      width: '30rem',
                      fontSize: '1.2rem',
                      position: 'absolute'
                    }}
                    text={`You can no longer earn Twinkle Coins by watching videos because you have more than 1,000 coins`}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  ) : null;
}
