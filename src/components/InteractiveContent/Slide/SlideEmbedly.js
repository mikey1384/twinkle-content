import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext } from 'contexts';

SlideEmbedly.propTypes = {
  url: PropTypes.string,
  siteUrl: PropTypes.string,
  thumbUrl: PropTypes.string,
  style: PropTypes.object
};

function SlideEmbedly({ url, siteUrl, thumbUrl, style }) {
  const {
    requestHelpers: { fetchUrlEmbedData }
  } = useAppContext();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  const fallbackImage = '/img/link.png';
  const contentCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: ${Color.darkerGray()};
    position: relative;
    overflow: hidden;
    flex-direction: column;
  `;

  useEffect(() => {
    mounted.current = true;
    if (!thumbUrl) {
      fetchUrlData();
    }
    async function fetchUrlData() {
      try {
        setLoading(true);
        const { image, title, description, site } = await fetchUrlEmbedData(
          url
        );
        if (mounted.current) {
          setLoading(false);
          console.log(image, title, description, site);
        }
      } catch (error) {
        setLoading(false);
        setImageUrl(fallbackImage);
        console.error(error.response || error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, siteUrl, thumbUrl]);

  useEffect(() => {
    return function cleanUp() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const InnerContent = useMemo(() => {
    return (
      <div className={contentCss}>
        {!imageUrl || loading ? (
          <Loading
            className={css`
              height: 30rem;
              @media (max-width: ${mobileMaxWidth}) {
                height: 25rem;
              }
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
                  content: '';
                  display: block;
                  padding-bottom: 60%;
                }
              `}
            >
              <img
                className={css`
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                `}
                src={imageUrl}
                onError={handleImageLoadError}
              />
            </section>
          </a>
        )}
      </div>
    );
    function handleImageLoadError() {
      setImageUrl(
        !thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl
      );
    }
  }, [contentCss, imageUrl, loading, thumbUrl, url]);

  return (
    <div style={{ position: 'relative', height: '100%', ...style }}>
      <div
        style={{ height: '100%' }}
        className={css`
          width: 100%;
          position: relative;
          height: 100%;
          align-items: center;
          display: flex;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <div
          className={css`
            width: 100%;
            height: 100%;
            > a {
              text-decoration: none;
            }
            h3 {
              font-size: 1.9rem;
            }
            p {
              font-size: 1.5rem;
              margin-top: 1rem;
            }
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              h3 {
                font-size: 1.7rem;
              }
              p {
                font-size: 1.3rem;
              }
            }
          `}
        >
          {InnerContent}
        </div>
      </div>
    </div>
  );
}

export default memo(SlideEmbedly);
