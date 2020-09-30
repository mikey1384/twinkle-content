import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ReactPlayer from 'react-player';
import ExtractedThumb from 'components/ExtractedThumb';
import { v1 as uuidv1 } from 'uuid';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';
import { useAppContext } from 'contexts';

FileViewer.propTypes = {
  slideId: PropTypes.number,
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  onThumbnailUpload: PropTypes.func.isRequired,
  thumbUrl: PropTypes.string
};

export default function FileViewer({
  onThumbnailUpload,
  src,
  style,
  slideId,
  thumbUrl
}) {
  const PlayerRef = useRef(null);
  const { fileType } = getFileInfoFromFileName(src);
  const {
    requestHelpers: { uploadThumbForInteractiveSlide }
  } = useAppContext();

  return (
    <div
      style={{
        width: '100%',
        ...style
      }}
    >
      {fileType === 'image' ? (
        <img style={{ width: '100%' }} src={`${cloudFrontURL}${src}`} />
      ) : fileType === 'video' || fileType === 'audio' ? (
        <div
          style={{
            width: '100%',
            position: 'relative',
            paddingTop:
              fileType === 'video'
                ? '56.25%'
                : fileType === 'audio'
                ? '3rem'
                : ''
          }}
        >
          <ReactPlayer
            playsinline
            ref={PlayerRef}
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
            height="100%"
            light={thumbUrl}
            onReady={handleReady}
            controls
            url={`${cloudFrontURL}${src}`}
          />
          {fileType !== 'audio' && (
            <ExtractedThumb
              src={`${cloudFrontURL}${src}`}
              style={{ width: '1px', height: '1px' }}
              onThumbnailLoad={handleThumbnailLoad}
              thumbUrl={thumbUrl}
            />
          )}
        </div>
      ) : (
        <FileInfo fileType={fileType} src={src} />
      )}
    </div>
  );

  function handleReady() {
    PlayerRef.current?.getInternalPlayer()?.play();
  }

  function handleThumbnailLoad(thumb) {
    const dataUri = thumb.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataUri, 'base64');
    const file = new File([buffer], 'thumb.png');
    handleUploadThumb();

    async function handleUploadThumb() {
      const thumbUrl = await uploadThumbForInteractiveSlide({
        slideId,
        file,
        path: uuidv1()
      });
      onThumbnailUpload(thumbUrl);
    }
  }
}
