import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ReactPlayer from 'react-player';
import ExtractedThumb from 'components/ExtractedThumb';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

FileViewer.propTypes = {
  small: PropTypes.bool,
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  onThumbnailLoad: PropTypes.func,
  thumbUrl: PropTypes.string
};

export default function FileViewer({
  onThumbnailLoad,
  small,
  src,
  style,
  thumbUrl
}) {
  const PlayerRef = useRef(null);
  const { fileType } = useMemo(() => getFileInfoFromFileName(src), [src]);
  const filePath = useMemo(() => {
    const srcArray = src.split('/');
    const fileName = srcArray[srcArray.length - 1];
    srcArray.pop();
    const result = [...srcArray, encodeURIComponent(fileName)].join('/');
    return result;
  }, [src]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        ...style
      }}
    >
      {fileType === 'image' ? (
        <img
          style={{
            width: small ? '40rem' : '100%',
            height: small ? '20rem' : '100%',
            objectFit: 'contain',
            maxHeight: '50vh'
          }}
          src={`${cloudFrontURL}${filePath}`}
        />
      ) : fileType === 'video' || fileType === 'audio' ? (
        <div
          style={{
            width: small ? '40rem' : '100%',
            position: 'relative',
            paddingTop:
              fileType === 'video'
                ? '56.25%'
                : fileType === 'audio'
                ? '3rem'
                : ''
          }}
        >
          <ReactPlayer
            playsinline
            ref={PlayerRef}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              paddingBottom:
                fileType === 'audio' || fileType === 'video' ? '1rem' : 0
            }}
            width="100%"
            height="100%"
            light={thumbUrl}
            onReady={handleReady}
            controls
            url={`${cloudFrontURL}${src}`}
          />
          {fileType !== 'audio' && (
            <ExtractedThumb
              src={`${cloudFrontURL}${src}`}
              style={{ width: '1px', height: '1px' }}
              onThumbnailLoad={onThumbnailLoad}
              thumbUrl={thumbUrl}
            />
          )}
        </div>
      ) : (
        <FileInfo fileType={fileType} src={src} />
      )}
    </div>
  );

  function handleReady() {
    PlayerRef.current?.getInternalPlayer()?.play();
  }
}
