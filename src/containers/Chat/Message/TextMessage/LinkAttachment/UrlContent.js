import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import YouTubeIcon from 'assets/YoutubeIcon.svg';
import { css } from '@emotion/css';
import { borderRadius, Color } from 'constants/css';

UrlContent.propTypes = {
  fallbackImage: PropTypes.string,
  imageUrl: PropTypes.string,
  isYouTube: PropTypes.bool,
  loading: PropTypes.bool,
  onSetImageUrl: PropTypes.func,
  thumbUrl: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
};

export default function UrlContent({
  fallbackImage,
  imageUrl,
  isYouTube,
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
          <a
            style={{ width: '100%', height: '100%' }}
            target="_blank"
            rel="noopener noreferrer"
            href={url}
          >
            {isYouTube ? (
              <div
                style={{ position: 'relative' }}
                className={css`
                  background: url(${imageUrl});
                  background-repeat: no-repeat;
                  background-position: center;
                  background-size: contain;
                  width: 100%;
                  height: 100%;
                `}
              >
                <img
                  style={{
                    width: '8rem',
                    height: '6rem',
                    position: 'absolute',
                    top: 'CALC(50% - 3rem)',
                    left: 'CALC(50% - 4rem)'
                  }}
                  src={YouTubeIcon}
                />
              </div>
            ) : (
              <img
                className={css`
                  border-radius: ${borderRadius};
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                `}
                src={imageUrl}
                onError={handleImageLoadError}
                alt={title}
              />
            )}
          </a>
        </section>
      )}
    </div>
  );

  function handleImageLoadError() {
    onSetImageUrl(
      !thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl
    );
  }
}
