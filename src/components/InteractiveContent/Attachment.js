import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import FileViewer from 'components/FileViewer';
import SlideEmbedly from './SlideEmbedly';
import { fetchedVideoCodeFromURL } from 'helpers/stringHelpers';
import { useAppContext } from 'contexts';
import { v1 as uuidv1 } from 'uuid';

Attachment.propTypes = {
  small: PropTypes.bool,
  type: PropTypes.string,
  fileUrl: PropTypes.string,
  linkUrl: PropTypes.string,
  isYouTubeVideo: PropTypes.bool,
  onEmbedDataLoad: PropTypes.func.isRequired,
  onSetEmbedProps: PropTypes.func.isRequired,
  thumbUrl: PropTypes.string,
  actualTitle: PropTypes.string,
  actualDescription: PropTypes.string,
  onThumbnailUpload: PropTypes.func,
  prevUrl: PropTypes.string,
  slideId: PropTypes.number,
  siteUrl: PropTypes.string,
  videoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function Attachment({
  small,
  type,
  fileUrl,
  linkUrl,
  isYouTubeVideo,
  onEmbedDataLoad,
  onSetEmbedProps,
  thumbUrl,
  actualTitle,
  actualDescription,
  onThumbnailUpload,
  prevUrl,
  slideId,
  siteUrl,
  videoHeight
}) {
  const {
    requestHelpers: { uploadThumbForInteractiveSlide }
  } = useAppContext();

  switch (type) {
    case 'file':
      return (
        <div
          className="unselectable"
          style={{ width: '80%', marginTop: '1rem' }}
        >
          <FileViewer
            small={small}
            slideId={slideId}
            thumbUrl={thumbUrl}
            src={fileUrl}
            onThumbnailLoad={handleThumbnailLoad}
          />
        </div>
      );
    case 'link':
      return isYouTubeVideo ? (
        small ? (
          <img
            className="unselectable"
            style={{ marginTop: '1rem', height: '20rem' }}
            src={`https://i.ytimg.com/vi/${fetchedVideoCodeFromURL(
              linkUrl
            )}/mqdefault.jpg`}
          />
        ) : (
          <div
            className="unselectable"
            style={{
              width: '100%',
              paddingTop: '57.25%',
              marginTop: '1rem',
              position: 'relative'
            }}
          >
            <ReactPlayer
              width="100%"
              height={videoHeight || '100%'}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
              }}
              url={linkUrl}
              controls
            />
          </div>
        )
      ) : (
        <SlideEmbedly
          className="unselectable"
          style={{ marginTop: '3rem', width: '50%' }}
          url={linkUrl}
          onSetEmbedProps={onSetEmbedProps}
          onEmbedDataLoad={onEmbedDataLoad}
          thumbUrl={thumbUrl}
          actualTitle={actualTitle}
          actualDescription={actualDescription}
          prevUrl={prevUrl}
          siteUrl={siteUrl}
        />
      );
    default:
      return null;
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
