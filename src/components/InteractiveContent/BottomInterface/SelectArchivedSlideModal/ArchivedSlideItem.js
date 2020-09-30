import React from 'react';
import PropTypes from 'prop-types';

ArchivedSlideItem.propTypes = {
  slide: PropTypes.object.isRequired
};

export default function ArchivedSlideItem({ slide }) {
  return (
    <div>
      <div>{slide.header}</div>
      <div>{slide.description}</div>
    </div>
  );
}
