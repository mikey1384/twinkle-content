import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import FullTextReveal from 'components/Texts/FullTextReveal';
import { videoRewardHash } from 'constants/defaultValues';
import { useContentState, useMyState } from 'helpers/hooks';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { addCommasToNumber } from 'helpers/stringHelpers';

XPBar.propTypes = {
  isChat: PropTypes.bool,
  onPlayVideo: PropTypes.func,
  rewardLevel: PropTypes.number,
  started: PropTypes.bool,
  startingPosition: PropTypes.number,
  userId: PropTypes.number,
  videoId: PropTypes.number.isRequired
};

export default function XPBar({
  isChat,
  onPlayVideo,
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
    () => rewardLevel * videoRewardHash[rewardBoostLvl].xp,
    [rewardBoostLvl, rewardLevel]
  );
  const coinRewardAmount = useMemo(() => videoRewardHash[rewardBoostLvl].coin, [
    rewardBoostLvl
  ]);
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

  const Bar = useMemo(() => {
    if (!userId || (!(watching && !started) && !rewardLevel)) {
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
                font-size: 1rem;
              }
            `}
            onClick={onPlayVideo}
          >
            {`Continue watching to earn ${addCommasToNumber(
              xpRewardAmount
            )} XP ${
              rewardLevel > 2 ? `and ${coinRewardAmount} Twinkle Coins ` : ''
            } every minute!`}
          </div>
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
              background: xpLevelColor,
              color: '#fff',
              fontWeight: 'bold',
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginLeft: '0.7rem' }}>
              {`Watch and earn ${addCommasToNumber(xpRewardAmount)} XP ${
                rewardLevel > 2 ? `and ${coinRewardAmount} Twinkle Coins ` : ''
              } every minute!`}
            </div>
          </div>
        );
      }
    }
  }, [
    userId,
    watching,
    started,
    rewardLevel,
    isChat,
    videoProgress,
    xpLevelColor,
    onPlayVideo,
    xpRewardAmount,
    coinRewardAmount
  ]);

  return userId ? (
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
        {!!rewardLevel && (
          <div
            className={css`
              height: 2.7rem;
              width: ${canEarnCoins
                ? numXpEarned > 0
                  ? '13rem'
                  : `1${rewardLevel - 1}rem`
                : '7rem'};
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
                background: ${xpLevelColor};
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.1rem;
                }
              `}
            >
              {numXpEarned > 0
                ? `+ ${numXpEarnedWithComma}`
                : [...Array(rewardLevel)].map((elem, index) => (
                    <Icon
                      key={index}
                      style={{ verticalAlign: 0 }}
                      icon="star"
                    />
                  ))}
            </div>
            {canEarnCoins && (
              <div>
                <div
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
                    font-size: 1.5rem;
                    background: ${Color.brownOrange(
                      twinkleCoins > 1000 ? 0.3 : 1
                    )};
                    @media (max-width: ${mobileMaxWidth}) {
                      min-width: ${isChat ? '3rem' : '5rem'};
                      font-size: ${isChat ? '0.8rem' : '1.5rem'};
                    }
                  `}
                >
                  {numCoinsEarned > 0 ? (
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
