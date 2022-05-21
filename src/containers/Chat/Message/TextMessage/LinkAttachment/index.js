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
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext, useContentContext } from 'contexts';
import { useContentState } from 'helpers/hooks';
import { cloudFrontURL } from 'constants/defaultValues';

const API_URL = `${URL}/content`;

LinkAttachment.propTypes = {
  contentId: PropTypes.number,
  defaultThumbUrl: PropTypes.string,
  extractedUrl: PropTypes.string,
  onHideAttachment: PropTypes.func,
  style: PropTypes.object,
  userCanEditThis: PropTypes.bool,
  videoWidth: PropTypes.string
};

function LinkAttachment({
  contentId,
  defaultThumbUrl,
  extractedUrl,
  onHideAttachment = () => {},
  style,
  userCanEditThis,
  videoWidth
}) {
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
    prevUrl,
    thumbUrl: rawThumbUrl,
    title,
    thumbLoaded,
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
      setImageUrl(
        !thumbUrl || imageUrl === thumbUrl ? fallbackImage : thumbUrl
      );
    }
  }, [imageUrl, loading, thumbUrl, title, url]);

  return (
    <div
      style={{
        position: 'relative',
        height: '35rem',
        ...style
      }}
    >
      <div
        style={{ height: '100%' }}
        className={css`
          width: 100%;
          height: 100%;
          position: relative;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        {userCanEditThis && !notFound && (
          <Icon
            style={{
              right: '1rem',
              position: 'absolute',
              cursor: 'pointer',
              zIndex: 10
            }}
            onClick={() => onHideAttachment()}
            className={css`
              right: ${isYouTube || twinkleVideoId
                ? '1rem'
                : 'CALC(50% - 1rem)'};
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
          {twinkleVideoId ? (
            <TwinkleVideo
              onPlay={handlePlay}
              style={{
                width: videoWidth || '50vw',
                height: 'CALC(100% - 2rem)'
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