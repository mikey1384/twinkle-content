import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import request from 'axios';
import Loading from 'components/Loading';
import ReactPlayer from 'react-player/youtube';
import Icon from 'components/Icon';
import URL from 'constants/URL';
import TwinkleVideo from './TwinkleVideo';
import { css } from '@emotion/css';
import {
  getFileInfoFromFileName,
  isValidYoutubeUrl,
  extractVideoIdFromTwinkleVideoUrl
} from 'helpers/stringHelpers';
import { useNavigate } from 'react-router-dom';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { cloudFrontURL } from 'constants/defaultValues';

const API_URL = `${URL}/content`;

LinkAttachment.propTypes = {
  contentId: PropTypes.number,
  directUrl: PropTypes.string,
  defaultThumbUrl: PropTypes.string,
  defaultActualTitle: PropTypes.string,
  defaultActualDescription: PropTypes.string,
  extractedUrl: PropTypes.string,
  imageWidth: PropTypes.string,
  imageOnly: PropTypes.bool,
  loadingHeight: PropTypes.string,
  mobileLoadingHeight: PropTypes.string,
  noLink: PropTypes.bool,
  onHideAttachment: PropTypes.func,
  small: PropTypes.bool,
  style: PropTypes.object,
  userCanEditThis: PropTypes.bool,
  videoWidth: PropTypes.string
};

function LinkAttachment({
  contentId,
  directUrl,
  defaultThumbUrl,
  defaultActualTitle,
  defaultActualDescription,
  extractedUrl,
  imageWidth,
  imageOnly,
  loadingHeight = '100%',
  mobileLoadingHeight = '100%',
  noLink,
  onHideAttachment = () => {},
  small,
  style,
  userCanEditThis,
  videoWidth
}) {
  const navigate = useNavigate();
  const makeThumbnailSecure = useAppContext(
    (v) => v.requestHelpers.makeThumbnailSecure
  );
  const translator = {
    actualDescription: 'linkDescription',
    actualTitle: 'linkTitle',
    siteUrl: 'linkUrl',
    url: 'embeddedUrl'
  };
  const onSetActualDescription = useContentContext(
    (v) => v.actions.onSetActualDescription
  );
  const onSetActualTitle = useContentContext((v) => v.actions.onSetActualTitle);
  const onSetSiteUrl = useContentContext((v) => v.actions.onSetSiteUrl);
  const onSetThumbUrl = useContentContext((v) => v.actions.onSetThumbUrl);
  const onSetVideoCurrentTime = useContentContext(
    (v) => v.actions.onSetVideoCurrentTime
  );
  const onSetMediaStarted = useContentContext(
    (v) => v.actions.onSetMediaStarted
  );

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
    [translator.url]: contentStateUrl
  } = useContentState({ contentType: 'chat', contentId });

  const url = useMemo(
    () => contentStateUrl || extractedUrl,
    [contentStateUrl, extractedUrl]
  );

  const thumbUrl = useMemo(() => {
    if (rawThumbUrl?.split('/')[1] === 'thumbs') {
      return `${cloudFrontURL}${rawThumbUrl}`;
    }
    return rawThumbUrl || defaultThumbUrl;
  }, [defaultThumbUrl, rawThumbUrl]);

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
    return isValidYoutubeUrl(url);
  }, [url]);
  const YTPlayerRef = useRef(null);
  const mounted = useRef(true);
  const loadingRef = useRef(false);
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
    if (extractedVideoId) {
      setTwinkleVideoId(extractedVideoId);
    } else if (
      !loadingRef.current &&
      url &&
      ((typeof siteUrl !== 'string' && !thumbUrl) ||
        (prevUrl && url !== prevUrl))
    ) {
      fetchUrlData();
    }
    async function fetchUrlData() {
      setLoading(true);
      loadingRef.current = true;
      try {
        const {
          data: { image, title, description, site }
        } = await request.put(`${API_URL}/embed`, {
          url,
          contentId,
          contentType: 'chat'
        });
        if (mounted.current) {
          onSetThumbUrl({
            contentId,
            contentType: 'chat',
            thumbUrl: image.url.replace('http://', 'https://')
          });
        }
        if (mounted.current) {
          onSetActualDescription({
            contentId,
            contentType: 'chat',
            description
          });
        }
        if (mounted.current) {
          onSetActualTitle({ contentId, contentType: 'chat', title });
        }
        if (mounted.current) {
          onSetSiteUrl({ contentId, contentType: 'chat', siteUrl: site });
        }
        if (mounted.current) {
          setLoading(false);
        }
      } catch (error) {
        if (mounted.current) {
          setLoading(false);
        }
        if (mounted.current) {
          setImageUrl(fallbackImage);
        }
        if (mounted.current) {
          onHideAttachment();
        }
        console.error(error.response || error);
      }
      loadingRef.current = false;
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
        makeThumbnailSecure({ contentId, contentType: 'chat', thumbUrl });
      }
      setImageUrl(thumbUrl || fallbackImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbUrl, url]);

  useEffect(() => {
    return function setCurrentTimeBeforeUnmount() {
      if (timeAt > 0) {
        onSetVideoCurrentTime({
          contentType: 'chat',
          contentId,
          currentTime: timeAt
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeAt]);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = useCallback(() => {
    onSetMediaStarted({
      contentType: 'chat',
      contentId,
      started: true
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

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
        ) : noLink ? (
          <div style={{ width: small ? '25%' : '100%', height: '100%' }}>
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
                  object-fit: contain;
                `}
                src={imageUrl}
                onError={handleImageLoadError}
                alt={title}
              />
            </section>
          </div>
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
                  object-fit: contain;
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
            'a',
            {
              style: {
                textDecoration: 'none',
                color: Color.darkerGray()
              },
              target: '_blank',
              rel: 'noopener noreferrer',
              href: true,
              className: css`
                width: 100%;
                line-height: 1.5;
                padding: 1rem;
                cursor: pointer;
                'margin-bottom: 1rem;
                ${small ? 'margin-left: 1rem;' : ''}
                ${small ? '' : 'margin-top: 1rem;'}
              `,
              onClick:
                small && !directUrl && !noLink
                  ? () => navigate(`/links/${contentId}`)
                  : null
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
    defaultActualDescription,
    defaultActualTitle,
    description,
    directUrl,
    navigate,
    imageOnly,
    imageUrl,
    loading,
    loadingHeight,
    mobileLoadingHeight,
    noLink,
    siteUrl,
    small,
    thumbUrl,
    title,
    url
  ]);

  return (
    <div
      style={{
        position: 'relative',
        height: '35rem',
        ...style
      }}
    >
      {userCanEditThis && !notFound && (
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
          width: ${imageWidth || '50%'};
          position: relative;
          align-items: center;
          justify-content: ${imageOnly && 'center'};
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
              font-size: 1.4rem;
            }
            p {
              font-size: 1.2rem;
              margin-top: 1rem;
            }
            @media (max-width: ${mobileMaxWidth}) {
              width: 85%;
              h3 {
                font-size: 1.3rem;
              }
              p {
                font-size: 1.1rem;
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
                height: '100%'
              }}
              videoId={Number(twinkleVideoId)}
            />
          ) : isYouTube ? (
            <ReactPlayer
              ref={YTPlayerRef}
              width="65rem"
              height="100%"
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

  function handleVideoProgress() {
    setTimeAt(YTPlayerRef.current.getCurrentTime());
  }
}

export default memo(LinkAttachment);
