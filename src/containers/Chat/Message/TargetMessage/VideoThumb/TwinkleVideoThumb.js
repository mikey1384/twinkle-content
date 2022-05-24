import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import VideoThumbImage from 'components/VideoThumbImage';
import { useContentState } from 'helpers/hooks';
import { extractVideoIdFromTwinkleVideoUrl } from 'helpers/stringHelpers';
import Loading from 'components/Loading';

TwinkleVideoThumb.propTypes = {
  videoUrl: PropTypes.string.isRequired
};

export default function TwinkleVideoThumb({ videoUrl }) {
  const videoId = useMemo(
    () => extractVideoIdFromTwinkleVideoUrl(videoUrl),
    [videoUrl]
  );
  const { content, rewardLevel } = useContentState({
    contentId: videoId,
    contentType: 'video'
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {content ? (
        <VideoThumbImage
          style={{ height: '5rem', cursor: 'pointer' }}
          rewardLevel={rewardLevel}
          videoId={videoId}
          src={`https://img.youtube.com/vi/${content}/mqdefault.jpg`}
          onClick={() => console.log('clicked')}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
