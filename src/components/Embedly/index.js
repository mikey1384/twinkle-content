import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import Loading from 'components/Loading';
import ReactPlayer from 'react-player';
import Icon from 'components/Icon';
import URL from 'constants/URL';
import TwinkleVideo from './TwinkleVideo';
import { css } from '@emotion/css';
import {
  getFileInfoFromFileName,
  isValidYoutubeUrl,
  extractVideoIdFromTwinkleVideoUrl
} from 'helpers/stringHelpers';
import { useHistory } from 'react-router-dom';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { cloudFrontURL } from 'constants/defaultValues';

const API_URL = `${URL}/content`;

Embedly.propTypes = {
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  defaultThumbUrl: PropTypes.string,
  defaultActualTitle: PropTypes.string,
  defaultActualDescription: PropTypes.string,
  imageWidth: PropTypes.string,
  imageOnly: PropTypes.bool,
  loadingHeight: PropTypes.string,
  mobileLoadingHeight: PropTypes.string,
  noLink: PropTypes.bool,
  onHideAttachment: PropTypes.func,
  small: PropTypes.bool,
  style: PropTypes.object,
  userCanEditThis: PropTypes.bool,
  videoWidth: PropTypes.string,
  videoHeight: PropTypes.string
};

function Embedly({
  contentId,
  contentType = 'url',
  defaultThumbUrl,
  defaultActualTitle,
  defaultActualDescription,
  imageWidth,
  imageOnly,
  loadingHeight = '100%',
  mobileLoadingHeight = '100%',
  noLink,
  onHideAttachment = () => {},
  small,
  style,
  userCanEditThis,
  videoWidth,
  videoHeight
}) {
  const history = useHistory();
  const {
    requestHelpers: { makeThumbnailSecure }
  } = useAppContext();
  const translator = {
    actualDescription:
      contentType === 'url' ? 'actualDescription' : 'linkDescription',
    actualTitle: contentType === 'url' ? 'actualTitle' : 'linkTitle',
    siteUrl: contentType === 'url' ? 'siteUrl' : 'linkUrl',
    url: contentType === 'url' ? 'content' : 'embeddedUrl'
  };
  const {
    actions: {
      onSetActualDescription,
      onSetActualTitle,
      onSetPrevUrl,
      onSetSiteUrl,
      onSetThumbUrl,
      onSetVideoCurrentTime,
      onSetVideoStarted
    }
  } = useContentContext();
  const {
    currentTime = 0,
    description,
    prevUrl,
    thumbUrl: rawThumbUrl,
    title,
    thumbLoaded,
    [translator.actualDescription]: actualDescription,
    [translator.actualTitle]: actualTitle,
    [translator.siteUrl]: siteUrl,
    [translator.url]: url
  } = useContentState({ contentType, contentId });

  const thumbUrl = useMemo(() => {
    if (rawThumbUrl?.split('/')[1] === 'thumbs') {
      return `${cloudFrontURL}${rawThumbUrl}`;
    }
    return rawThumbUrl;
  }, [rawThumbUrl]);

  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [twinkleVideoId, setTwinkleVideoId] = useState(false);
  const [timeAt, setTimeAt] = useState(0);
  const [startingPosition, setStartingPosition] = useState(0);
  const { notFound } = useContentState({
    contentId: Number(twinkleVideoId),
    contentType: 'video'
  });
  const isYouTube = useMemo(() => {
    return contentType === 'chat' && isValidYoutubeUrl(url);
  }, [contentType, url]);
  const YTPlayerRef = useRef(null);
  const mounted = useRef(true);
  const fallbackImage = '/img/link.png';
  const contentCss = useMemo(
    () => css`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      color: ${Color.darkerGray()};
      position: relative;
      overflow: hidden;
      ${!small ? 'flex-direction: column;' : ''};
    `,
    [small]
  );

  useEffect(() => {
    if (isYouTube) {
      setStartingPosition(currentTime);
    }
    const extractedVideoId = extractVideoIdFromTwinkleVideoUrl(url);
    if (extractedVideoId && contentType === 'chat') {
      return setTwinkleVideoId(extractedVideoId);
    }
    if (
      url &&
      ((typeof siteUrl !== 'string' && !thumbUrl) ||
        (prevUrl && url !== prevUrl))
    ) {
      fetchUrlData();
    }
    onSetPrevUrl({ contentId, contentType, prevUrl: url, thumbUrl });
    async function fetchUrlData() {
      try {
        setLoading(true);
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, {
          url,
          contentId,
          contentType
        });
        if (mounted.current) {
          onSetThumbUrl({
            contentId,
            contentType,
            thumbUrl: image.url.replace('http://', 'https://')
          });
          onSetActualDescription({ contentId, contentType, description });
          onSetActualTitle({ contentId, contentType, title });
          onSetSiteUrl({ contentId, contentType, siteUrl: site });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setImageUrl(fallbackImage);
        console.error(error.response || error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevUrl, url, thumbLoaded, siteUrl, thumbUrl]);

  const videoUrl = useMemo(
    () => `${url}${startingPosition > 0 ? `?t=${startingPosition}` : ''}`,
    [startingPosition, url]
  );

  useEffect(() => {
    if (
      url &&
      !url.includes('http://') &&
      getFileInfoFromFileName(url)?.fileType === 'image'
    ) {
      setImageUrl(url);
    } else {
      if (thumbUrl?.includes('http://')) {
        makeThumbnailSecure({ contentId, contentType, thumbUrl });
      }
      setImageUrl(thumbUrl || defaultThumbUrl || fallbackImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultThumbUrl, thumbUrl, url]);

  useEffect(() => {
    return function setCurrentTimeBeforeUnmount() {
      if (timeAt > 0) {
        onSetVideoCurrentTime({
          contentType,
          contentId,
          currentTime: timeAt
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeAt]);

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
              height: ${loadingHeight};
              @media (max-width: ${mobileMaxWidth}) {
                height: ${mobileLoadingHeight};
              }
            `}
          />
        ) : (
          <a
            style={{ width: small ? '25%' : '100%', height: '100%' }}
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
                  padding-bottom: ${small ? '100%' : '60%'};
                }
              `}
            >
              <img
                className={css`
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  object-fit: ${contentType === 'chat' ? 'contain' : 'cover'};
                `}
                src={imageUrl}
                onError={handleImageLoadError}
                alt={title}
              />
            </section>
          </a>
        )}
        {!imageOnly &&
          React.createElement(
            contentType === 'chat' ? 'a' : 'section',
            {
              style: {
                textDecoration: 'none',
                color: Color.darkerGray()
              },
              target: contentType === 'chat' ? '_blank' : null,
              rel: contentType === 'chat' ? 'noopener noreferrer' : null,
              href: contentType === 'chat' ? url : null,
              className: css`
                width: 100%;
                line-height: 1.5;
                padding: 1rem;
                cursor: ${contentType === 'chat' || small ? 'pointer' : ''};
                ${contentType === 'chat' ? 'margin-bottom: 1rem;' : ''}
                ${small ? 'margin-left: 1rem;' : ''}
                ${small ? '' : 'margin-top: 1rem;'}
              `,
              onClick: small ? () => history.push(`/links/${contentId}`) : null
            },
            <>
              <h3
                style={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {actualTitle || defaultActualTitle || title}
              </h3>
              <p
                style={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {actualDescription || defaultActualDescription || description}
              </p>
              <p style={{ fontWeight: 'bold' }}>{siteUrl}</p>
            </>
          )}
      </div>
    );
    function handleImageLoadError() {
      setImageUrl(
        !thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl
      );
    }
  }, [
    actualDescription,
    actualTitle,
    contentCss,
    contentId,
    contentType,
    defaultActualDescription,
    defaultActualTitle,
    description,
    history,
    imageOnly,
    imageUrl,
    loading,
    loadingHeight,
    mobileLoadingHeight,
    siteUrl,
    small,
    thumbUrl,
    title,
    url
  ]);

  return (
    <div style={{ position: 'relative', height: '100%', ...style }}>
      {contentType === 'chat' && userCanEditThis && !notFound && (
        <Icon
          style={{
            position: 'absolute',
            cursor: 'pointer',
            zIndex: 10
          }}
          onClick={() => onHideAttachment()}
          className={css`
            right: ${isYouTube || twinkleVideoId ? '1rem' : 'CALC(50% - 1rem)'};
            color: ${Color.darkGray()};
            font-size: 2rem;
            &:hover {
              color: ${Color.black()};
            }
            @media (max-width: ${mobileMaxWidth}) {
              right: 1rem;
            }
          `}
          icon="times"
        />
      )}
      <div
        style={{ height: '100%' }}
        className={css`
          width: ${imageWidth || (contentType === 'chat' ? '50%' : '100%')};
          position: relative;
          height: 100%;
          align-items: center;
          justify-content: ${contentType === 'chat' && imageOnly && 'center'};
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
              font-size: ${contentType === 'chat' ? '1.4rem' : '1.9rem'};
            }
            p {
              font-size: ${contentType === 'chat' ? '1.2rem' : '1.5rem'};
              margin-top: 1rem;
            }
            @media (max-width: ${mobileMaxWidth}) {
              width: ${contentType === 'chat' ? '85%' : '100%'};
              h3 {
                font-size: ${contentType === 'chat' ? '1.3rem' : '1.7rem'};
              }
              p {
                font-size: ${contentType === 'chat' ? '1.1rem' : '1.3rem'};
              }
            }
          `}
        >
          {noLink ? (
            <div className={contentCss}>{InnerContent}</div>
          ) : twinkleVideoId ? (
            <TwinkleVideo
              imageOnly={imageOnly}
              onPlay={handlePlay}
              style={{
                width: videoWidth || '50vw',
                height: videoHeight || 'CALC(30vw + 3rem)'
              }}
              videoId={Number(twinkleVideoId)}
            />
          ) : isYouTube ? (
            <ReactPlayer
              ref={YTPlayerRef}
              width={videoWidth || '50vw'}
              height={videoHeight || '30vw'}
              url={videoUrl}
              controls
              onPlay={handlePlay}
              onProgress={handleVideoProgress}
            />
          ) : (
            InnerContent
          )}
        </div>
      </div>
    </div>
  );

  function handlePlay() {
    onSetVideoStarted({
      contentType,
      contentId,
      started: true
    });
  }

  function handleVideoProgress() {
    setTimeAt(YTPlayerRef.current.getCurrentTime());
  }
}

export default memo(Embedly);
