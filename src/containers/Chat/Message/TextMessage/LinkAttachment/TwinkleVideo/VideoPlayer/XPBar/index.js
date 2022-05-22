import React, { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import FullTextReveal from 'components/Texts/FullTextReveal';
import XPProgressBar from './XPProgressBar';
import { useContentState, useMyState } from 'helpers/hooks';
import { isMobile } from 'helpers';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { returnXpLevelColor } from 'constants/defaultValues';
import { addCommasToNumber } from 'helpers/stringHelpers';
import Link from 'components/Link';

const deviceIsMobile = isMobile(navigator);

XPBar.propTypes = {
  loaded: PropTypes.bool,
  rewardLevel: PropTypes.number,
  reachedMaxWatchDuration: PropTypes.bool,
  started: PropTypes.bool,
  startingPosition: PropTypes.number,
  userId: PropTypes.number,
  videoId: PropTypes.number.isRequired
};

function XPBar({
  loaded,
  rewardLevel,
  started,
  startingPosition,
  userId,
  reachedMaxWatchDuration,
  videoId
}) {
  const [coinHovered, setCoinHovered] = useState(false);
  const [xpHovered, setXPHovered] = useState(false);
  const { rewardBoostLvl, twinkleCoins } = useMyState();
  const canEarnCoins = rewardLevel >= 3;
  const {
    videoProgress = 0,
    numCoinsEarned = 0,
    numXpEarned = 0
  } = useContentState({
    contentType: 'video',
    contentId: videoId
  });

  const numXpEarnedWithComma = useMemo(
    () => addCommasToNumber(numXpEarned),
    [numXpEarned]
  );
  const numCoinsEarnedWithComma = useMemo(
    () => addCommasToNumber(numCoinsEarned),
    [numCoinsEarned]
  );
  const xpLevelColor = useMemo(
    () => returnXpLevelColor(rewardLevel),
    [rewardLevel]
  );
  const Stars = useMemo(
    () =>
      [...Array(rewardLevel)].map((elem, index) => (
        <Icon key={index} style={{ verticalAlign: 0 }} icon="star" />
      )),
    [rewardLevel]
  );

  return (
    <ErrorBoundary>
      <div style={{ height: '5rem', marginTop: '1rem' }}>
        <div
          className={css`
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
          `}
        >
          <XPProgressBar
            started={started}
            startingPosition={startingPosition}
            userId={userId}
            rewardLevel={rewardLevel}
            rewardBoostLvl={rewardBoostLvl}
            videoProgress={videoProgress}
          />
          {rewardLevel ? (
            <div
              className={css`
                height: 2.7rem;
                min-width: ${canEarnCoins ? `1${rewardLevel - 1}rem` : '7rem'};
                margin-left: 1rem;
                display: flex;
                @media (max-width: ${mobileMaxWidth}) {
                  min-width: 0;
                  max-width: 8.5rem;
                  height: 2rem;
                }
              `}
            >
              <div
                className={css`
                  flex-grow: 1;
                `}
              >
                <div
                  className={css`
                    height: 100%;
                    width: 100%;
                    display: flex;
                    position: relative;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    font-size: 1.3rem;
                    font-weight: bold;
                    background: ${Color[xpLevelColor](
                      reachedMaxWatchDuration ? 0.3 : 1
                    )};
                    cursor: default;
                    @media (max-width: ${mobileMaxWidth}) {
                      flex-grow: 0;
                      width: 5rem;
                      font-size: ${numXpEarned > 0 ? '0.7rem' : '1rem'};
                    }
                  `}
                  onMouseEnter={
                    reachedMaxWatchDuration
                      ? () => setXPHovered(true)
                      : () => {}
                  }
                  onMouseLeave={() => setXPHovered(false)}
                >
                  {numXpEarned > 0 && !reachedMaxWatchDuration
                    ? `+ ${numXpEarnedWithComma}`
                    : deviceIsMobile
                    ? `${rewardLevel}-STAR`
                    : Stars}
                </div>
                {xpHovered ? (
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
                    text={`You have earned all the XP you can earn from this video`}
                  />
                ) : null}
              </div>
              {canEarnCoins && (
                <div>
                  <div
                    onClick={() =>
                      deviceIsMobile
                        ? setCoinHovered((hovered) => !hovered)
                        : {}
                    }
                    onMouseEnter={
                      twinkleCoins > 1000
                        ? () => setCoinHovered(true)
                        : () => {}
                    }
                    onMouseLeave={() => setCoinHovered(false)}
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
                  {coinHovered && (
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
          ) : null}
        </div>
        {loaded && (
          <div
            style={{
              marginTop: '0.5rem',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <Link
              className={css`
                font-weight: bold;
                font-size: 1.7rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1rem;
                }
              `}
              to={`/videos/${videoId}`}
            >
              Comment or post subjects about this video
            </Link>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default memo(XPBar);
