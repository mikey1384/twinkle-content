import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import YouTubeThumb from './YouTubeThumb';
import TwinkleVideoThumb from './TwinkleVideoThumb';

VideoThumb.propTypes = {
  style: PropTypes.object,
  thumbUrl: PropTypes.string,
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
export default function VideoThumb({ thumbUrl, videoId, style }) {
  const isYouTube = useMemo(() => !!thumbUrl, [thumbUrl]);
  return (
    <ErrorBoundary>
      {isYouTube ? (
        <YouTubeThumb style={style} thumbUrl={thumbUrl} />
      ) : (
        <TwinkleVideoThumb style={style} videoId={videoId} />
      )}
    </ErrorBoundary>
  );
}
