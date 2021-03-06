import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ImageModal from 'components/Modals/ImageModal';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { cloudFrontURL } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { useAppContext } from 'contexts';

Frame.propTypes = {
  forCarousel: PropTypes.bool,
  picture: PropTypes.object.isRequired,
  userIsUploader: PropTypes.bool,
  onUpdatePictureCaption: PropTypes.func,
  style: PropTypes.object
};

export default function Frame({
  forCarousel,
  onUpdatePictureCaption,
  picture,
  style,
  userIsUploader
}) {
  const {
    requestHelpers: { updateUserPictureCaption }
  } = useAppContext();
  const imageUrl = useMemo(() => {
    return picture?.src ? `${cloudFrontURL}${picture?.src}` : '';
  }, [picture]);
  const [imageModalShown, setImageModalShown] = useState(false);
  const frameWidth = forCarousel ? 100 : 33;

  return (
    <div
      style={style}
      className={css`
        background: black;
        position: relative;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        width: CALC(${frameWidth}% - 2rem);
        height: ${frameWidth}%;
        padding-bottom: CALC(${frameWidth}% - 2rem - 2px);
      `}
    >
      {imageUrl && (
        <img
          draggable={false}
          style={{
            cursor: 'pointer',
            borderRadius: innerBorderRadius,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center'
          }}
          onClick={() => setImageModalShown(true)}
          src={imageUrl}
        />
      )}
      {imageModalShown && (
        <ImageModal
          hasCaption
          caption={picture?.caption}
          downloadable={false}
          src={imageUrl}
          userIsUploader={userIsUploader}
          onEditCaption={handleEditCaption}
          onHide={() => setImageModalShown(false)}
        />
      )}
    </div>
  );

  async function handleEditCaption(text) {
    await updateUserPictureCaption({ caption: text, pictureId: picture.id });
    onUpdatePictureCaption({ caption: text, pictureId: picture.id });
  }
}
