import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import { cloudFrontURL } from 'constants/defaultValues';

Attachment.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string
};

export default function Attachment({ type, src }) {
  switch (type) {
    case 'image':
      return (
        <div style={{ width: '80%', marginTop: '3rem' }}>
          <img style={{ width: '100%' }} src={`${cloudFrontURL}${src}`} />
        </div>
      );
    case 'youtube':
      return (
        <ReactPlayer
          style={{ marginTop: '3rem', maxWidth: '100%' }}
          url={src}
          controls
        />
      );
    default:
      return null;
  }
}
