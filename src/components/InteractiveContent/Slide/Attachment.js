import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import FileViewer from './FileViewer';
import SlideEmbedly from './SlideEmbedly';

Attachment.propTypes = {
  type: PropTypes.string,
  fileUrl: PropTypes.string,
  linkUrl: PropTypes.string,
  isYouTubeVideo: PropTypes.bool
};

export default function Attachment({ type, fileUrl, linkUrl, isYouTubeVideo }) {
  switch (type) {
    case 'file':
      return (
        <div style={{ width: '80%', marginTop: '3rem' }}>
          <FileViewer src={fileUrl} />
        </div>
      );
    case 'link':
      return isYouTubeVideo ? (
        <ReactPlayer
          style={{ marginTop: '3rem', maxWidth: '100%' }}
          url={linkUrl}
          controls
        />
      ) : (
        <SlideEmbedly style={{ width: '100%' }} url={linkUrl} />
      );
    default:
      return null;
  }
}
