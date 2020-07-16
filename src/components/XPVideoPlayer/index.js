import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import ErrorBoundary from 'components/ErrorBoundary';
import XPBar from './XPBar';
import { rewardValue } from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useContentState, useMyState } from 'helpers/hooks';
import {
  useAppContext,
  useContentContext,
  useExploreContext,
  useViewContext
} from 'contexts';

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
      updateCurrentlyWatching,
      updateUserXP,
      updateTotalViewDuration,
      updateVideoXPEarned
    }
  } = useAppContext();
  const { profileTheme, userId } = useMyState();
  const {
    state: {
      videos: { currentVideoSlot }
    },
    actions: { onEmptyCurrentVideoSlot, onFillCurrentVideoSlot }
  } = useExploreContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const {
    actions: {
      onChangeUserCoins,
      onChangeUserXP,
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
    imageUrl = '',
    watchTime = 0,
    isEditing
  } = useContentState({ contentType: 'video', contentId: videoId });
  const [playing, setPlaying] = useState(false);
  const [alreadyEarned, setAlreadyEarned] = useState(false);
  const [startingPosition, setStartingPosition] = useState(0);
  const timeAt = useRef(0);
  const requiredDuration = 120;
  const PlayerRef = useRef(null);
  const timerRef = useRef(null);
  const timeWatchedRef = useRef(0);
  const totalDurationRef = useRef(0);
  const userIdRef = useRef(null);
  const watchCodeRef = useRef(Math.floor(Math.random() * 10000));
  const mounted = useRef(true);
  const rewardingXP = useRef(false);
  const themeColor = profileTheme || 'logoBlue';
  const rewardLevelRef = useRef(0);
  const rewardAmountRef = useRef(rewardLevel * rewardValue);
  const xpEarnedRef = useRef(xpEarned);

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

    if (!!rewardLevel && userId && !xpLoaded) {
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
  }, [rewardLevel, userId, videoId, xpLoaded]);

  useEffect(() => {
    if (isEditing) {
      handleVideoStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    xpEarnedRef.current = xpEarned;
    if (userId && xpEarned) {
      setAlreadyEarned(true);
    }
    if (!userId) {
      setAlreadyEarned(false);
      onSetVideoXpEarned({ videoId, earned: false });
      onSetVideoXpJustEarned({ videoId, justEarned: false });
      onSetVideoXpLoaded({ videoId, loaded: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, xpEarned]);

  useEffect(() => {
    PlayerRef.current.getInternalPlayer()?.pauseVideo?.();
  }, [userId]);

  useEffect(() => {
    const userWatchingMultipleVideo =
      currentVideoSlot &&
      watchCodeRef.current &&
      currentVideoSlot !== watchCodeRef.current;
    if (started && userWatchingMultipleVideo) {
      handleVideoStop();
      PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoSlot]);

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
            background: ${Color[themeColor](0.9)};
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
        <img
          alt=""
          src={imageUrl}
          className={css`
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            cursor: pointer;
          `}
        />
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
      <XPBar
        alreadyEarned={alreadyEarned}
        isChat={isChat}
        justEarned={justEarned}
        onPlayVideo={() => PlayerRef.current?.getInternalPlayer()?.playVideo()}
        rewardLevel={rewardLevel}
        started={started}
        startingPosition={startingPosition}
        userId={userId}
        videoId={videoId}
        xpEarned={xpEarned}
        xpLoaded={xpLoaded}
      />
    </ErrorBoundary>
  );

  function onVideoReady() {
    totalDurationRef.current = PlayerRef.current
      .getInternalPlayer()
      ?.getDuration();
  }

  function onVideoPlay({ userId, watchTime }) {
    onSetVideoStarted({
      contentType: 'video',
      contentId: videoId,
      started: true
    });
    if (!playing) {
      setPlaying(true);
      const time = PlayerRef.current.getCurrentTime();
      if (Math.floor(time) === 0) {
        addVideoView({ videoId, userId });
      }
      if (!currentVideoSlot) {
        onFillCurrentVideoSlot(watchCodeRef.current);
      }
      clearInterval(timerRef.current);
      timerRef.current = setInterval(
        () => handleIncreaseMeter({ userId, watchTime }),
        intervalLength
      );
    }
    if (!!rewardLevel && !(justEarned || xpEarned)) {
      updateCurrentlyWatching({
        watchCode: watchCodeRef.current
      });
    }
  }

  function handleVideoStop() {
    setPlaying(false);
    clearInterval(timerRef.current);
    onEmptyCurrentVideoSlot();
  }

  async function handleIncreaseMeter({ userId, watchTime }) {
    timeAt.current = PlayerRef.current.getCurrentTime();
    if (!totalDurationRef.current) {
      onVideoReady();
    }
    if (
      !!rewardLevelRef.current &&
      !xpEarnedRef.current &&
      !justEarned &&
      userId
    ) {
      if (PlayerRef.current.getInternalPlayer()?.isMuted()) {
        PlayerRef.current.getInternalPlayer()?.unMute();
      }
      const requiredViewDuration =
        totalDurationRef.current < requiredDuration + 10
          ? Math.floor(totalDurationRef.current * 0.8)
          : requiredDuration;
      if (
        rewardAmountRef.current &&
        timeWatchedRef.current >= requiredViewDuration &&
        !rewardingXP.current &&
        userId
      ) {
        rewardingXP.current = true;
        try {
          await updateVideoXPEarned(videoId);
          const { alreadyDone, xp, rank, coins } = await updateUserXP({
            action: 'watch',
            target: 'video',
            amount: rewardAmountRef.current,
            targetId: videoId,
            type: 'increase'
          });
          if (alreadyDone) return;
          onChangeUserCoins({ coins, userId });
          onChangeUserXP({ xp, rank, userId });
          onSetVideoXpJustEarned({ videoId, justEarned: true });
          onSetVideoXpEarned({ videoId, earned: true });
          xpEarnedRef.current = true;
          rewardingXP.current = false;
          clearInterval(timerRef.current);
        } catch (error) {
          console.error(error.response || error);
        }
      }
      timeWatchedRef.current = Math.max(
        timeWatchedRef.current + intervalLength / 1000,
        watchTime
      );
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
      const {
        notLoggedIn,
        success,
        currentlyWatchingAnotherVideo
      } = await updateTotalViewDuration({
        videoId,
        rewardLevel: rewardLevelRef.current,
        watchCode: watchCodeRef.current
      });
      if (success || notLoggedIn) return;
      if (
        currentlyWatchingAnotherVideo &&
        !xpEarned &&
        !!rewardLevelRef.current &&
        !justEarned
      ) {
        PlayerRef.current.getInternalPlayer()?.pauseVideo?.();
      }
    }
  }
}

export default memo(XPVideoPlayer);
