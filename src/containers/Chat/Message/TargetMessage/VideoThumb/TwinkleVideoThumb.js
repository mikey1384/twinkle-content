import React from 'react';
import PropTypes from 'prop-types';

TwinkleVideoThumb.propTypes = {
  messageId: PropTypes.number.isRequired
};

export default function TwinkleVideoThumb({ messageId }) {
  return (
    <div>
      <div>{messageId} this is twinkle video thumb</div>
    </div>
  );
}
