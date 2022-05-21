import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { css } from '@emotion/css';
import { Color } from 'constants/css';

UrlContent.propTypes = {
  fallbackImage: PropTypes.string,
  imageUrl: PropTypes.string,
  loading: PropTypes.bool,
  onSetImageUrl: PropTypes.func,
  thumbUrl: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
};

export default function UrlContent({
  fallbackImage,
  imageUrl,
  loading,
  onSetImageUrl,
  thumbUrl,
  title,
  url
}) {
  return (
    <div
      className={`
      color: ${Color.darkerGray()};
      position: relative;
      overflow: hidden;
    `}
      style={{ width: '100%', height: '100%' }}
    >
      {!imageUrl || loading ? (
        <Loading
          className={css`
            height: 100%;
          `}
        />
      ) : (
        <a
          style={{ width: '100%', height: '100%' }}
          target="_blank"
          rel="noopener noreferrer"
          href={url}
        >
          <section
            className={css`
              position: relative;
              width: 100%;
              height: 100%;
              &:after {
                padding-bottom: 60%;
                content: '';
                display: block;
              }
            `}
          >
            <img
              className={css`
                width: 100%;
                height: 100%;
                object-fit: contain;
              `}
              src={imageUrl}
              onError={handleImageLoadError}
              alt={title}
            />
          </section>
        </a>
      )}
    </div>
  );

  function handleImageLoadError() {
    onSetImageUrl(
      !thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl
    );
  }
}
