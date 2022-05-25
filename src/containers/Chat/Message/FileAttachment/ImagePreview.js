import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImageModal from 'components/Modals/ImageModal';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired
};

export default function ImagePreview({ src, fileName }) {
  const [imageModalShown, setImageModalShown] = useState(false);
  const [imageWorks, setImageWorks] = useState(true);
  return imageWorks ? (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: 'auto',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
    >
      <img
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          cursor: 'pointer'
        }}
        className={css`
          height: 25vw;
          @media (max-width: ${mobileMaxWidth}) {
            height: 50vw;
          }
        `}
        src={src}
        rel={fileName}
        onClick={() => setImageModalShown(true)}
        onError={() => setImageWorks(false)}
      />
      {imageModalShown && (
        <ImageModal
          onHide={() => setImageModalShown(false)}
          fileName={fileName}
          src={src}
        />
      )}
    </div>
  ) : null;
}
