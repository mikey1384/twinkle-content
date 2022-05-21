import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import VideoPlayer from './VideoPlayer';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';

TwinkleVideo.propTypes = {
  onPlay: PropTypes.func,
  style: PropTypes.object,
  videoId: PropTypes.number.isRequired
};

export default function TwinkleVideo({ onPlay, style, videoId }) {
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
