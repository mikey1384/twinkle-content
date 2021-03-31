import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import ErrorBoundary from 'components/ErrorBoundary';
import XPBar from './XPBar';
import { videoRewardHash, strongColors } from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

const intervalLength = 2000;

XPVideoPlayer.propTypes = {
  isChat: PropTypes.bool,
  byUser: PropTypes.bool,
  minimized: PropTypes.bool,
  onPlay: PropTypes.func,
  rewardLevel: PropTypes.number,
  style: PropTypes.object,
  uploader: PropTypes.object.isRequired,
  videoCode: PropTypes.string.isRequired,
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function XPVideoPlayer({
  isChat,
  byUser,
  rewardLevel,
  minimized,
  onPlay,
  style = {},
  uploader,
  videoCode,
  videoId
}) {
  const {
    requestHelpers: {
      addVideoView,
      checkCurrentlyWatchingAnotherVideo,
      finishWatchingVideo,
      loadVideoCurrentTime,
      updateCurrentlyWatching,
      updateUserCoins,
      updateUserXP,
      updateTotalViewDuration
    }
  } = useAppContext();
  const { profileTheme, rewardBoostLvl, userId, twinkleCoins } = useMyState();
  const coinRewardAmount = useMemo(() => videoRewardHash[rewardBoostLvl].coin, [
    rewardBoostLvl
  ]);

  const coinRewardAmountRef = useRef(coinRewardAmount);
  useEffect(() => {
    coinRewardAmountRef.current = coinRewardAmount;
  }, [coinRewardAmount]);

  const xpRewardAmount = useMemo(
    () => videoRewardHash[rewardBoostLvl].xp * rewardLevel,
    [rewardBoostLvl, rewardLevel]
  );
  const xpRewardAmountRef = useRef(xpRewardAmount);
  useEffect(() => {
    xpRewardAmountRef.current = xpRewardAmount;
  }, [xpRewardAmount]);
  const {
    actions: {
      onChangeUserXP,
      onUpdateUserCoins,
      onIncreaseNumCoinsEarned,
      onIncreaseNumXpEarned,
      onSetVideoProgress,
      onSetVideoStarted,
      onSetTimeWatched
    }
  } = useContentContext();
  const {
    started,
    timeWatched: prevTimeWatched = 0,
    isEditing
  } = useContentState({
    contentType: 'video',
    contentId: videoId
  });
  const [playing, setPlaying] = useState(false);
  const [startingPosition, setStartingPosition] = useState(0);
  const requiredDurationForCoin = 60;
  const PlayerRef = useRef(null);
  const timerRef = useRef(null);
  const timeWatchedRef = useRef(prevTimeWatched);
  const totalDurationRef = useRef(0);
  const userIdRef = useRef(userId);
  const watchCodeRef = useRef(Math.floor(Math.random() * 10000));
  const mounted = useRef(true);
  const rewardingCoin = useRef(false);
  const rewardingXP = useRef(false);
  const themeColor = profileTheme || 'logoBlue';
  const rewardLevelRef = useRef(0);

  useEffect(() => {
    init();
    async function init() {
      if (userId) {
        const currentTime = await loadVideoCurrentTime(videoId);
        if (currentTime) {
          setStartingPosition(currentTime);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      handleVideoStop();
      onSetVideoStarted({
        contentType: 'video',
        contentId: videoId,
        started: false
      });
      clearInterval(timerRef.current);
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    if (isEditing) {
      handleVideoStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    userIdRef.current = userId;
    rewardLevelRef.current = rewardLevel;
    PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
  }, [userId, rewardLevel]);

  const videoUrl = useMemo(
    () =>
      `https://www.youtube.com/watch?v=${videoCode}${
        startingPosition > 0 ? `?t=${startingPosition}` : ''
      }`,
    [startingPosition, videoCode]
  );

  return (
    <ErrorBoundary style={style}>
      {byUser && !isChat && (
        <div
          className={css`
            background: ${Color[themeColor](
              strongColors.includes(themeColor) ? 0.7 : 0.9
            )};
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 1.5rem;
            color: #fff;
            justify-content: center;
            padding: 0.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              padding: 0.3rem;
              font-size: ${isChat ? '1rem' : '1.5rem'};
            }
          `}
        >
          <div>
            {uploader.youtubeUrl ? (
              <a
                style={{
                  color: '#fff',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                target="_blank"
                rel="noopener noreferrer"
                href={uploader.youtubeUrl}
              >
                {`Visit ${uploader.username}'s`} YouTube Channel
              </a>
            ) : (
              <span>This video was made by {uploader.username}</span>
            )}
          </div>
        </div>
      )}
      <div
        className={`${css`
          user-select: none;
          position: relative;
          padding-top: 56.25%;
        `}${minimized ? ' desktop' : ''}`}
        style={{
          display: minimized && !started && 'none',
          width: started && minimized && '39rem',
          paddingTop: started && minimized && '22rem',
          position: started && minimized && 'absolute',
          bottom: started && minimized && '1rem',
          right: started && minimized && '1rem',
          cursor: !isEditing && !started && 'pointer'
        }}
      >
        <ReactPlayer
          ref={PlayerRef}
          className={css`
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          `}
          width="100%"
          height="100%"
          url={videoUrl}
          playing={playing}
          controls
          onReady={onVideoReady}
          onPlay={() => {
            onPlay?.();
            onVideoPlay({
              userId: userIdRef.current
            });
          }}
          onPause={handleVideoStop}
          onEnded={() => {
            handleVideoStop();
            if (userIdRef.current) {
              finishWatchingVideo(videoId);
            }
          }}
        />
      </div>
      {(!!rewardLevel || (startingPosition > 0 && !started)) && (
        <XPBar
          isChat={isChat}
          onPlayVideo={() =>
            PlayerRef.current?.getInternalPlayer()?.playVideo()
          }
          rewardLevel={rewardLevel}
          started={started}
          startingPosition={startingPosition}
          userId={userId}
          videoId={videoId}
        />
      )}
    </ErrorBoundary>
  );

  function onVideoReady() {
    totalDurationRef.current = PlayerRef.current
      ?.getInternalPlayer()
      ?.getDuration();
  }

  async function onVideoPlay({ userId }) {
    onSetVideoStarted({
      contentType: 'video',
      contentId: videoId,
      started: true
    });
    if (!playing) {
      await updateCurrentlyWatching({
        watchCode: watchCodeRef.current
      });
      setPlaying(true);
      const time = PlayerRef.current.getCurrentTime();
      if (Math.floor(time) === 0 && userId) {
        addVideoView({ videoId, userId });
      }
      clearInterval(timerRef.current);
      if (userId) {
        timerRef.current = setInterval(
          () => handleIncreaseMeter({ userId }),
          intervalLength
        );
      }
    }
  }

  function handleVideoStop() {
    setPlaying(false);
    clearInterval(timerRef.current);
  }

  async function handleIncreaseMeter({ userId }) {
    const timeAt = PlayerRef.current.getCurrentTime();
    if (!totalDurationRef.current) {
      onVideoReady();
    }
    checkAlreadyWatchingAnotherVideo();
    updateTotalViewDuration({
      videoId,
      currentTime: timeAt,
      totalTime: totalDurationRef.current
    });
    if (
      PlayerRef.current?.getInternalPlayer()?.isMuted() ||
      PlayerRef.current?.getInternalPlayer()?.getVolume() === 0
    ) {
      return;
    }
    if (timeWatchedRef.current >= requiredDurationForCoin && userId) {
      onSetTimeWatched({ videoId, timeWatched: 0 });
      timeWatchedRef.current = 0;
      onSetVideoProgress({
        videoId,
        progress: 0
      });
      if (twinkleCoins <= 1000 && rewardLevel > 2 && !rewardingCoin.current) {
        rewardingCoin.current = true;
        try {
          const coins = await updateUserCoins({
            action: 'watch',
            target: 'video',
            amount: coinRewardAmountRef.current,
            targetId: videoId,
            type: 'increase'
          });
          onUpdateUserCoins({ coins, userId });
          rewardingCoin.current = false;
        } catch (error) {
          console.error(error.response || error);
          rewardingCoin.current = false;
        }
      }
      if (!rewardingXP.current) {
        rewardingXP.current = true;
        try {
          const { xp, rank } = await updateUserXP({
            action: 'watch',
            target: 'video',
            amount: xpRewardAmountRef.current,
            targetId: videoId,
            type: 'increase'
          });
          onChangeUserXP({ xp, rank, userId });
          rewardingXP.current = false;
        } catch (error) {
          console.error(error.response || error);
          rewardingXP.current = false;
        }
      }
      if (twinkleCoins <= 1000 && rewardLevel > 2) {
        onIncreaseNumCoinsEarned({
          videoId,
          amount: coinRewardAmountRef.current
        });
      }
      onIncreaseNumXpEarned({
        videoId,
        amount: xpRewardAmountRef.current
      });
      return;
    }
    onSetTimeWatched({
      videoId,
      timeWatched: timeWatchedRef.current + intervalLength / 1000
    });
    timeWatchedRef.current = timeWatchedRef.current + intervalLength / 1000;
    onSetVideoProgress({
      videoId,
      progress: Math.floor(
        (Math.min(timeWatchedRef.current, requiredDurationForCoin) * 100) /
          requiredDurationForCoin
      )
    });

    async function checkAlreadyWatchingAnotherVideo() {
      if (rewardLevelRef.current) {
        const currentlyWatchingAnotherVideo = await checkCurrentlyWatchingAnotherVideo(
          {
            rewardLevel: rewardLevelRef.current,
            watchCode: watchCodeRef.current
          }
        );
        if (currentlyWatchingAnotherVideo) {
          PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
        }
      }
    }
  }
}

export default memo(XPVideoPlayer);
