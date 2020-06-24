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
  xpEarned: PropTypes.bool,
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
  xpEarned,
  xpLoaded
}) {
  const rewardAmount = useMemo(() => rewardLevel * rewardValue.star, [
    rewardLevel
  ]);
  const { progress = 0 } = useContentState({
    contentType: 'video',
    contentId: videoId
  });

  const meterColor = useMemo(
    () =>
      xpEarned
        ? Color.green()
        : rewardLevel === 5
        ? Color.gold()
        : rewardLevel === 4
        ? Color.brownOrange()
        : rewardLevel === 3
        ? Color.orange()
        : rewardLevel === 2
        ? Color.pink()
        : Color.logoBlue(),
    [rewardLevel, xpEarned]
  );

  return (
    <ErrorBoundary>
      {startingPosition > 0 && !started ? (
        <div
          style={{
            background: Color.darkBlue(),
            padding: '0.5rem',
            color: '#fff',
            fontSize: '1.5rem',
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
      ) : (!userId || xpLoaded) &&
        !!rewardLevel &&
        (!started || alreadyEarned) ? (
        <div
          className={css`
            font-size: 1.5rem;
            padding: 0.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              padding: 0.3rem;
              font-size: ${isChat ? '1rem' : '1.5rem'};
            }
          `}
          style={{
            background: meterColor,
            color: '#fff',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {!alreadyEarned && (
            <div>
              {[...Array(rewardLevel)].map((elem, index) => (
                <Icon key={index} icon="star" />
              ))}
            </div>
          )}
          <div style={{ marginLeft: '0.7rem' }}>
            {alreadyEarned
              ? 'You have earned XP from this video'
              : `Watch and earn ${addCommasToNumber(rewardAmount)} XP`}
          </div>
        </div>
      ) : null}
      {!alreadyEarned && !!rewardLevel && userId && started && (
        <ProgressBar
          progress={progress}
          color={justEarned ? Color.green() : meterColor}
          noBorderRadius
          text={
            justEarned ? `Earned ${addCommasToNumber(rewardAmount)} XP!` : ''
          }
        />
      )}
    </ErrorBoundary>
  );
}
