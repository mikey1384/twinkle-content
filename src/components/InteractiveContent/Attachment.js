import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import FileViewer from './FileViewer';
import SlideEmbedly from './SlideEmbedly';

Attachment.propTypes = {
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
  switch (type) {
    case 'file':
      return (
        <div style={{ width: '80%', marginTop: '3rem' }}>
          <FileViewer
            slideId={slideId}
            thumbUrl={thumbUrl}
            src={fileUrl}
            onThumbnailUpload={onThumbnailUpload}
          />
        </div>
      );
    case 'link':
      return isYouTubeVideo ? (
        <div
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
      ) : (
        <SlideEmbedly
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
}
