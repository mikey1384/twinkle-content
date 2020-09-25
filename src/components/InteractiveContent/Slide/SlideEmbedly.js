import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
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
          console.log(image.url);
          setImageUrl(image.url);
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

  return (
    <div style={{ position: 'relative', ...style }}>
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
          style={{ width: '100%' }}
          target="_blank"
          rel="noopener noreferrer"
          href={url}
        >
          <img
            style={{ width: '100%', objectFit: 'cover' }}
            src={imageUrl}
            onError={handleImageLoadError}
          />
        </a>
      )}
    </div>
  );

  function handleImageLoadError() {
    setImageUrl(!thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl);
  }
}

export default memo(SlideEmbedly);
