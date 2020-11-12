import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ImageModal from 'components/Modals/ImageModal';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { cloudFrontURL } from 'constants/defaultValues';

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
      style={{
        border: `1px solid ${Color.borderGray()}`,
        borderRadius,
        width: '20rem',
        height: '20rem',
        margin: '1rem'
      }}
    >
      {imageUrl && (
        <img
          style={{
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            borderRadius: innerBorderRadius
          }}
          onClick={() => setImageModalShown(true)}
          src={imageUrl}
        />
      )}
      {imageModalShown && (
        <ImageModal src={imageUrl} onHide={() => setImageModalShown(false)} />
      )}
    </div>
  );
}
