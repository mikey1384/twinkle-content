import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ExtractedThumb from 'components/ExtractedThumb';
import ReactPlayer from 'react-player';
import { v1 as uuidv1 } from 'uuid';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { isMobile } from 'helpers';

MediaPlayer.propTypes = {
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  fileType: PropTypes.string,
  isThumb: PropTypes.bool,
  src: PropTypes.string,
  thumbUrl: PropTypes.string,
  videoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function MediaPlayer({
  contentId,
  contentType,
  fileType,
  isThumb,
  src,
  thumbUrl,
  videoHeight
}) {
  const {
    requestHelpers: { uploadThumb }
  } = useAppContext();
  const {
    actions: { onSetThumbUrl, onSetVideoCurrentTime }
  } = useContentContext();
  const { currentTime = 0 } = useContentState({ contentType, contentId });
  const timeAtRef = useRef(0);
  const PlayerRef = useRef(null);
  const mobile = isMobile(navigator);

  useEffect(() => {
    if (currentTime > 0) {
      PlayerRef.current?.seekTo(currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return function setCurrentTimeBeforeUnmount() {
      if (timeAtRef.current > 0) {
        onSetVideoCurrentTime({
          contentType,
          contentId,
          currentTime: timeAtRef.current
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const light = useMemo(() => {
    if (fileType === 'audio' || currentTime || (!mobile && !thumbUrl)) {
      return false;
    }
    return thumbUrl;
  }, [currentTime, fileType, mobile, thumbUrl]);

  return (
    <div
      style={{
        marginTop: isThumb ? 0 : '1rem',
        width: '100%',
        position: 'relative',
        paddingTop:
          fileType === 'video' && !isThumb
            ? '56.25%'
            : fileType === 'audio'
            ? '3rem'
            : ''
      }}
    >
      {fileType !== 'audio' && (
        <ExtractedThumb
          src={src}
          isHidden={!isThumb}
          style={{ width: '100%', height: '7rem' }}
          onThumbnailLoad={handleThumbnailLoad}
          thumbUrl={thumbUrl}
        />
      )}
      {!isThumb && (
        <ReactPlayer
          light={light}
          ref={PlayerRef}
          playsinline
          muted={isThumb}
          onProgress={handleVideoProgress}
          onReady={handleReady}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            paddingBottom:
              fileType === 'audio' || fileType === 'video' ? '1rem' : 0
          }}
          width="100%"
          height={fileType === 'video' ? videoHeight || '100%' : '5rem'}
          url={src}
          controls={!isThumb}
        />
      )}
    </div>
  );

  function handleReady() {
    if (light) {
      PlayerRef.current?.getInternalPlayer()?.play();
    }
  }

  function handleThumbnailLoad(thumb) {
    const dataUri = thumb.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataUri, 'base64');
    const file = new File([buffer], 'thumb.png');
    handleUploadThumb();

    async function handleUploadThumb() {
      const thumbUrl = await uploadThumb({
        contentType,
        contentId,
        file,
        path: uuidv1()
      });
      onSetThumbUrl({
        contentId,
        contentType,
        thumbUrl
      });
    }
  }

  function handleVideoProgress() {
    timeAtRef.current = PlayerRef.current.getCurrentTime();
  }
}
