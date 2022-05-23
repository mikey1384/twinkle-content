import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import YouTubeIcon from 'assets/YoutubeIcon.svg';
import { css } from '@emotion/css';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

UrlContent.propTypes = {
  actualTitle: PropTypes.string,
  actualDescription: PropTypes.string,
  fallbackImage: PropTypes.string,
  imageUrl: PropTypes.string,
  isYouTube: PropTypes.bool,
  loading: PropTypes.bool,
  onSetImageUrl: PropTypes.func,
  thumbUrl: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
  siteUrl: PropTypes.string
};

export default function UrlContent({
  actualTitle,
  actualDescription,
  fallbackImage,
  imageUrl,
  isYouTube,
  loading,
  onSetImageUrl,
  thumbUrl,
  title,
  url,
  siteUrl
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
      {!imageUrl || (!isYouTube && loading) ? (
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
            height: 27rem;
            &:after {
              padding-bottom: 60%;
              content: '';
              display: block;
            }
            @media (max-width: ${mobileMaxWidth}) {
              height: 13rem;
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
          <div
            className={css`
              margin-top: 1rem;
              height: 8rem;
              @media (max-width: ${mobileMaxWidth}) {
                height: 7rem;
              }
            `}
          >
            <h3
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {actualTitle || title}
            </h3>
            {actualDescription && (
              <p
                style={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {actualDescription}
              </p>
            )}
            {siteUrl || isYouTube ? (
              <p style={{ fontWeight: 'bold' }}>
                {isYouTube ? 'YouTube' : siteUrl}
              </p>
            ) : null}
          </div>
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
