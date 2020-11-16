import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { cloudFrontURL } from 'constants/defaultValues';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';

Picture.propTypes = {
  picture: PropTypes.object.isRequired,
  numPictures: PropTypes.number,
  style: PropTypes.object
};

export default function Picture({ numPictures, picture, style }) {
  const imageUrl = useMemo(() => {
    return picture?.src ? `${cloudFrontURL}${picture?.src}` : '';
  }, [picture]);

  return (
    <div
      className={css`
        position: relative;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        width: CALC(${100 / (numPictures + 1)}% - 2rem);
        padding-bottom: CALC(${100 / (numPictures + 1)}% - 2rem - 2px);
      `}
      style={style}
    >
      <img
        style={{
          borderRadius: innerBorderRadius,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        src={imageUrl}
      />
    </div>
  );
}
