import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { Color } from 'constants/css';

Image.propTypes = {
  backgroundColor: PropTypes.string,
  imageUrl: PropTypes.string.isRequired
};

export default function Image({ imageUrl, backgroundColor }) {
  return imageUrl ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: backgroundColor || Color.black()
      }}
    >
      <img
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        src={imageUrl}
        rel=""
      />
    </div>
  ) : (
    <Loading />
  );
}
