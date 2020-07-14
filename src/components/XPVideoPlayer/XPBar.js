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
  const rewardAmount = useMemo(() => rewardLevel * rewardValue, [rewardLevel]);
  const { progress = 0 } = useContentState({
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

  const notWatched = useMemo(
    () => !userId || (xpLoaded && !!rewardLevel && (!started || alreadyEarned)),
    [alreadyEarned, rewardLevel, started, userId, xpLoaded]
  );

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
        {startingPosition > 0 && !started ? (
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
        ) : notWatched ? (
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
              background: Color.green(),
              color: '#fff',
              fontWeight: 'bold',
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div>
              {[...Array(rewardLevel)].map((elem, index) => (
                <Icon key={index} icon="star" />
              ))}
            </div>
            <div style={{ marginLeft: '0.7rem' }}>
              Watch and earn {addCommasToNumber(rewardAmount)} XP
            </div>
          </div>
        ) : (
          !alreadyEarned &&
          !!rewardLevel &&
          userId &&
          started && (
            <ProgressBar
              style={{
                marginTop: 0,
                flexGrow: 1,
                height: '2.7rem'
              }}
              progress={progress}
              color={Color.green()}
              noBorderRadius
            />
          )
        )}
        {xpLoaded && (
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
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
