import React from 'react';
import PropTypes from 'prop-types';

TwinkleVideoThumb.propTypes = {
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function TwinkleVideoThumb({ videoId }) {
  return (
    <div>
      <div>{videoId} this is twinkle video thumb</div>
    </div>
  );
}
