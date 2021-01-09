import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext } from 'contexts';

SlideEmbedly.propTypes = {
  actualDescription: PropTypes.string,
  actualTitle: PropTypes.string,
  url: PropTypes.string,
  siteUrl: PropTypes.string,
  thumbUrl: PropTypes.string,
  style: PropTypes.object,
  onSetEmbedProps: PropTypes.func.isRequired,
  onEmbedDataLoad: PropTypes.func.isRequired,
  prevUrl: PropTypes.string
};

function SlideEmbedly({
  style,
  onSetEmbedProps,
  url,
  thumbUrl,
  actualTitle,
  actualDescription,
  prevUrl,
  siteUrl,
  onEmbedDataLoad
}) {
  const {
    requestHelpers: { fetchUrlEmbedData }
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  const fallbackImage = '/img/link.png';

  useEffect(() => {
    if (!thumbUrl || (prevUrl && url !== prevUrl)) {
      fetchUrlData();
    }
    onSetEmbedProps({ prevUrl: url });
    async function fetchUrlData() {
      try {
        setLoading(true);
        const { image, title, description, site } = await fetchUrlEmbedData(
          url
        );
        if (mounted.current) {
          setLoading(false);
          onSetEmbedProps({
            thumbUrl: image.url,
            actualTitle: title,
            actualDescription: description,
            siteUrl: site,
            prevUrl: url
          });
          onEmbedDataLoad({
            thumbUrl: image.url,
            actualTitle: title,
            actualDescription: description,
            siteUrl: site
          });
        }
      } catch (error) {
        setLoading(false);
        onSetEmbedProps({ thumbUrl: fallbackImage });
        console.error(error.response || error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, thumbUrl, prevUrl]);

  useEffect(() => {
    return function cleanUp() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'relative', ...style }}>
      {loading ? (
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
          style={{ width: '100%' }}
          target="_blank"
          rel="noopener noreferrer"
          href={url}
        >
          <img
            style={{ width: '100%', objectFit: 'cover' }}
            src={thumbUrl}
            onError={handleImageLoadError}
            alt={actualTitle || ''}
          />
        </a>
      )}
      <div style={{ color: Color.darkerGray() }}>
        <h3
          style={{
            marginTop: '1rem',
            fontSize: '1.7rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {actualTitle}
        </h3>
        <p
          style={{
            marginTop: '1rem',
            fontSize: '1.3rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {actualDescription}
        </p>
        <p
          style={{ fontWeight: 'bold', marginTop: '1rem', fontSize: '1.3rem' }}
        >
          {siteUrl}
        </p>
      </div>
    </div>
  );

  function handleImageLoadError() {
    onSetEmbedProps({ thumbUrl: thumbUrl || fallbackImage });
  }
}

export default memo(SlideEmbedly);
