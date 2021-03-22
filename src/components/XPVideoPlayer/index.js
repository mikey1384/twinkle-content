import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import ErrorBoundary from 'components/ErrorBoundary';
import XPBar from './XPBar';
import { rewardValue, strongColors } from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useViewContext } from 'contexts';

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
      checkXPEarned,
      checkCurrentlyWatchingAnotherVideo,
      updateCurrentlyWatching,
      updateUserCoins,
      updateUserXP,
      updateTotalViewDuration,
      updateVideoXPEarned
    }
  } = useAppContext();
  const { profileTheme, userId, twinkleCoins, twinkleXP } = useMyState();
  const {
    state: { pageVisible }
  } = useViewContext();
  const {
    actions: {
      onUpdateUserCoins,
      onChangeUserXP,
      onIncreaseNumCoinsEarned,
      onSetVideoCoinProgress,
      onSetVideoStarted,
      onSetVideoXpEarned,
      onSetVideoXpJustEarned,
      onSetVideoXpLoaded,
      onSetVideoXpProgress,
      onSetXpVideoWatchTime,
      onSetVideoCurrentTime
    }
  } = useContentContext();
  const {
    currentTime = 0,
    started,
    xpLoaded,
    xpEarned,
    justEarned,
    watchTime = 0,
    isEditing
  } = useContentState({ contentType: 'video', contentId: videoId });
  const [playing, setPlaying] = useState(false);
  const [startingPosition, setStartingPosition] = useState(0);
  const timeAt = useRef(0);
  const requiredDurationForCoin = 60;
  const thresholdXP1 = 3000 * 1000;
  const thresholdXP2 = 6000 * 1000;
  const requiredDurationForXP =
    twinkleXP > thresholdXP2 ? 300 : twinkleXP > thresholdXP1 ? 180 : 120;
  const PlayerRef = useRef(null);
  const timerRef = useRef(null);
  const timeWatchedRef = useRef(0);
  const totalDurationRef = useRef(0);
  const userIdRef = useRef(null);
  const watchCodeRef = useRef(Math.floor(Math.random() * 10000));
  const mounted = useRef(true);
  const rewardingCoin = useRef(false);
  const rewardingXP = useRef(false);
  const themeColor = profileTheme || 'logoBlue';
  const rewardLevelRef = useRef(0);
  const rewardAmountRef = useRef(rewardLevel * rewardValue);
  const xpEarnedRef = useRef(xpEarned);
  const canEarnCoins = rewardLevelRef.current >= 3;
  const coinRewardAmount = 2;

  useEffect(() => {
    mounted.current = true;
    setStartingPosition(currentTime);
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
  }, []);

  useEffect(() => {
    timeWatchedRef.current = watchTime;
  }, [watchTime]);

  useEffect(() => {
    return function setCurrentTimeBeforeUnmount() {
      if (timeAt.current > 0) {
        onSetVideoCurrentTime({
          contentType: 'video',
          contentId: videoId,
          currentTime: timeAt.current
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeAt.current]);

  useEffect(() => {
    rewardLevelRef.current = rewardLevel;
    rewardAmountRef.current = rewardLevel * rewardValue;

    if (!!rewardLevel && userId) {
      handleCheckXPEarned();
    }

    async function handleCheckXPEarned() {
      const xpEarned = await checkXPEarned(videoId);
      if (mounted.current) {
        onSetVideoXpEarned({ videoId, earned: !!xpEarned });
        onSetVideoXpLoaded({ videoId, loaded: true });
      }
    }
    userIdRef.current = userId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardLevel, userId, videoId]);

  useEffect(() => {
    if (isEditing) {
      handleVideoStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    xpEarnedRef.current = xpEarned;
    if (!userId) {
      onSetVideoXpEarned({ videoId, earned: false });
      onSetVideoXpJustEarned({ videoId, justEarned: false });
      onSetVideoXpLoaded({ videoId, loaded: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, xpEarned]);

  useEffect(() => {
    PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
  }, [userId, rewardLevel]);

  useEffect(() => {
    const alreadyEarned = xpEarned || justEarned;
    if (started && !!rewardLevel && userId && !alreadyEarned) {
      handleVideoStop();
      PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVisible]);

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
              userId: userIdRef.current,
              watchTime
            });
          }}
          onPause={handleVideoStop}
          onEnded={handleVideoStop}
        />
      </div>
      {(!!rewardLevel || (startingPosition > 0 && !started)) && (
        <XPBar
          alreadyEarned={xpEarned}
          isChat={isChat}
          justEarned={justEarned}
          onPlayVideo={() =>
            PlayerRef.current?.getInternalPlayer()?.playVideo()
          }
          rewardLevel={rewardLevel}
          started={started}
          startingPosition={startingPosition}
          userId={userId}
          videoId={videoId}
          xpEarned={xpEarned}
          xpLoaded={xpLoaded}
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
      if (Math.floor(time) === 0) {
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
    timeAt.current = PlayerRef.current.getCurrentTime();
    if (!totalDurationRef.current) {
      onVideoReady();
    }
    checkAlreadyWatchingAnotherVideo();
    updateTotalViewDuration({ videoId });
    if (
      !!rewardLevelRef.current &&
      !xpEarnedRef.current &&
      !justEarned &&
      userId
    ) {
      increaseXPMeter();
    } else if (canEarnCoins) {
      increaseCoinMeter();
    }

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

    async function increaseCoinMeter() {
      if (
        PlayerRef.current?.getInternalPlayer()?.isMuted() ||
        PlayerRef.current?.getInternalPlayer()?.getVolume() === 0
      ) {
        return;
      }
      if (
        rewardAmountRef.current &&
        timeWatchedRef.current >= requiredDurationForCoin &&
        !rewardingCoin.current &&
        userId
      ) {
        timeWatchedRef.current = 0;
        onSetXpVideoWatchTime({
          videoId,
          watchTime: 0
        });
        onSetVideoCoinProgress({
          videoId,
          progress: 0
        });
        if (twinkleCoins + coinRewardAmount <= 1000) {
          rewardingCoin.current = true;
          try {
            const coins = await updateUserCoins({
              action: 'watch',
              target: 'video',
              amount: coinRewardAmount,
              targetId: videoId,
              type: 'increase'
            });
            onUpdateUserCoins({ coins, userId });
            onIncreaseNumCoinsEarned({ videoId });
            rewardingCoin.current = false;
          } catch (error) {
            console.error(error.response || error);
            rewardingCoin.current = false;
          }
        }
        return;
      }
      timeWatchedRef.current = timeWatchedRef.current + intervalLength / 1000;
      onSetXpVideoWatchTime({
        videoId,
        watchTime: timeWatchedRef.current
      });
      onSetVideoCoinProgress({
        videoId,
        progress: Math.floor(
          (Math.min(timeWatchedRef.current, requiredDurationForCoin) * 100) /
            requiredDurationForCoin
        )
      });
    }

    async function increaseXPMeter() {
      if (
        PlayerRef.current?.getInternalPlayer()?.isMuted() ||
        PlayerRef.current?.getInternalPlayer()?.getVolume() === 0
      ) {
        return;
      }
      const requiredViewDuration =
        totalDurationRef.current < requiredDurationForXP + 10
          ? Math.floor(totalDurationRef.current * 0.8)
          : requiredDurationForXP;
      if (
        rewardAmountRef.current &&
        timeWatchedRef.current >= requiredViewDuration &&
        !rewardingXP.current &&
        userId
      ) {
        onSetVideoXpEarned({ videoId, earned: true });
        onSetVideoXpJustEarned({ videoId, justEarned: true });
        timeWatchedRef.current = 0;
        onSetXpVideoWatchTime({
          videoId,
          watchTime: 0
        });
        rewardingXP.current = true;
        try {
          await updateVideoXPEarned(videoId);
          const { alreadyDone, xp, rank } = await updateUserXP({
            action: 'watch',
            target: 'video',
            amount: rewardAmountRef.current,
            targetId: videoId,
            type: 'increase'
          });
          if (alreadyDone) return;
          onChangeUserXP({ xp, rank, userId });
          xpEarnedRef.current = true;
          rewardingXP.current = false;
        } catch (error) {
          console.error(error.response || error);
          rewardingXP.current = false;
        }
        return;
      }
      timeWatchedRef.current = timeWatchedRef.current + intervalLength / 1000;
      onSetXpVideoWatchTime({
        videoId,
        watchTime: timeWatchedRef.current
      });
      onSetVideoXpProgress({
        videoId,
        progress:
          requiredViewDuration > 0
            ? Math.floor(
                (Math.min(timeWatchedRef.current, requiredViewDuration) * 100) /
                  requiredViewDuration
              )
            : 0
      });
    }
  }
}

export default memo(XPVideoPlayer);
