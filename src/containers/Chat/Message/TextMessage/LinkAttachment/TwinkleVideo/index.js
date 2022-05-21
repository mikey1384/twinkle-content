import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import VideoPlayer from './VideoPlayer';
import YouTubeIcon from 'assets/YoutubeIcon.svg';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { isMobile } from 'helpers';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/css';

const deviceIsMobile = isMobile(navigator);

TwinkleVideo.propTypes = {
  onPlay: PropTypes.func,
  style: PropTypes.object,
  videoId: PropTypes.number.isRequired
};

export default function TwinkleVideo({ onPlay, style, videoId }) {
  const navigate = useNavigate();
  const loadContent = useAppContext((v) => v.requestHelpers.loadContent);
  const onInitContent = useContentContext((v) => v.actions.onInitContent);
  const { loaded, notFound, byUser, content, rewardLevel, uploader } =
    useContentState({
      contentId: videoId,
      contentType: 'video'
    });
  useEffect(() => {
    if (!loaded) {
      init();
    }
    async function init() {
      const data = await loadContent({
        contentId: videoId,
        contentType: 'video'
      });
      onInitContent({ ...data, contentType: 'video' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !notFound ? (
    <div style={{ position: 'relative', ...style }}>
      {!loaded ? (
        <Loading style={{ height: '100%' }} />
      ) : deviceIsMobile ? (
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          className={css`
            background: url(https://img.youtube.com/vi/${content}/mqdefault.jpg);
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            width: 100%;
            height: 100%;
          `}
          onClick={() => navigate(`/videos/${videoId}`)}
        >
          <img
            style={{
              width: '8rem',
              height: '6rem',
              position: 'absolute',
              top: 'CALC(50% - 3rem)',
              left: 'CALC(50% - 4rem)'
            }}
            src={YouTubeIcon}
          />
        </div>
      ) : (
        <VideoPlayer
          isChat
          loaded={loaded}
          style={{ width: '65rem', height: '100%' }}
          byUser={!!byUser}
          rewardLevel={rewardLevel}
          uploader={uploader}
          videoCode={content}
          videoId={videoId}
          onPlay={onPlay}
        />
      )}
    </div>
  ) : null;
}
