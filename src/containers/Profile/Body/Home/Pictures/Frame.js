import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ImageModal from 'components/Modals/ImageModal';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { cloudFrontURL } from 'constants/defaultValues';
import { css } from 'emotion';

Frame.propTypes = {
  picture: PropTypes.object.isRequired
};

export default function Frame({ picture }) {
  const imageUrl = useMemo(() => {
    return picture?.url ? `${cloudFrontURL}${picture?.url}` : '';
  }, [picture]);
  const [imageModalShown, setImageModalShown] = useState(false);

  return (
    <div
      className={css`
        position: relative;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        width: CALC(100% - 2rem);
        padding-bottom: CALC(100% - 2rem - 2px);
      `}
    >
      {imageUrl && (
        <img
          style={{
            cursor: 'pointer',
            borderRadius: innerBorderRadius,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          onClick={() => setImageModalShown(true)}
          src={imageUrl}
        />
      )}
      {imageModalShown && (
        <ImageModal
          caption={picture?.caption}
          downloadable={false}
          src={imageUrl}
          onHide={() => setImageModalShown(false)}
        />
      )}
    </div>
  );
}
