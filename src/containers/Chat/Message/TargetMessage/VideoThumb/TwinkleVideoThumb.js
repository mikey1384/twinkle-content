import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import VideoThumbImage from 'components/VideoThumbImage';
import Loading from 'components/Loading';
import TwinkleVideoModal from './TwinkleVideoModal';
import { useContentState } from 'helpers/hooks';
import { extractVideoIdFromTwinkleVideoUrl } from 'helpers/stringHelpers';

TwinkleVideoThumb.propTypes = {
  messageId: PropTypes.number.isRequired,
  videoUrl: PropTypes.string.isRequired
};

export default function TwinkleVideoThumb({ messageId, videoUrl }) {
  const [modalShown, setModalShown] = useState(false);
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
          videoId={Number(videoId)}
          src={`https://img.youtube.com/vi/${content}/mqdefault.jpg`}
          onClick={() => setModalShown(true)}
        />
      ) : (
        <Loading />
      )}
      {modalShown && (
        <TwinkleVideoModal
          messageId={messageId}
          videoId={Number(videoId)}
          url={videoUrl}
          onHide={() => setModalShown(false)}
        />
      )}
    </div>
  );
}
