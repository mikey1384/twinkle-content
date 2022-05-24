import React from 'react';
import PropTypes from 'prop-types';

YouTubeThumb.propTypes = {
  style: PropTypes.object,
  thumbUrl: PropTypes.string
};

export default function YouTubeThumb({ style, thumbUrl }) {
  return (
    <div style={style}>
      <img style={{ width: '100%' }} src={thumbUrl} />
    </div>
  );
}
