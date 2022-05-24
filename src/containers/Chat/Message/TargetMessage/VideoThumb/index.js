import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import YouTubeThumb from './YouTubeThumb';
import TwinkleVideoThumb from './TwinkleVideoThumb';

VideoThumb.propTypes = {
  style: PropTypes.object,
  thumbUrl: PropTypes.string,
  messageId: PropTypes.number.isRequired,
  videoUrl: PropTypes.string
};

export default function VideoThumb({ thumbUrl, messageId, style, videoUrl }) {
  const isYouTube = useMemo(() => !!thumbUrl, [thumbUrl]);
  return (
    <ErrorBoundary>
      {isYouTube ? (
        <YouTubeThumb
          messageId={messageId}
          style={style}
          thumbUrl={thumbUrl}
          videoUrl={videoUrl}
        />
      ) : (
        <TwinkleVideoThumb style={style} messageId={messageId} />
      )}
    </ErrorBoundary>
  );
}
