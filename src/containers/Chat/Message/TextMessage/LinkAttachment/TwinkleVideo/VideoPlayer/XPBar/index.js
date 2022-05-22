import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import XPProgressBar from './XPProgressBar';
import RewardLevelInfo from '../../RewardLevelInfo';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import Link from 'components/Link';

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
          />
          <RewardLevelInfo
            reachedMaxWatchDuration={reachedMaxWatchDuration}
            rewardLevel={rewardLevel}
            videoId={videoId}
          />
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
