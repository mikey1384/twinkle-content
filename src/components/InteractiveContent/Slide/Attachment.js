import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import FileViewer from '../FileViewer';

Attachment.propTypes = {
  type: PropTypes.string,
  fileUrl: PropTypes.string,
  linkUrl: PropTypes.string
};

export default function Attachment({ type, fileUrl, linkUrl }) {
  switch (type) {
    case 'file':
      return (
        <div style={{ width: '80%', marginTop: '3rem' }}>
          <FileViewer src={fileUrl} />
        </div>
      );
    case 'link':
      return (
        <ReactPlayer
          style={{ marginTop: '3rem', maxWidth: '100%' }}
          url={linkUrl}
          controls
        />
      );
    default:
      return null;
  }
}
