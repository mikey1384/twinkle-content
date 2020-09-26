import React from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo';
import ReactPlayer from 'react-player';
import { cloudFrontURL } from 'constants/defaultValues';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

FileViewer.propTypes = {
  src: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default function FileViewer({ src, style }) {
  const { fileType } = getFileInfoFromFileName(src);

  return (
    <div
      style={{
        width: '100%',
        ...style
      }}
    >
      {fileType === 'image' ? (
        <img style={{ width: '100%' }} src={`${cloudFrontURL}${src}`} />
      ) : fileType === 'video' || fileType === 'audio' ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <ReactPlayer
            playsinline
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
            url={`${cloudFrontURL}${src}`}
          />
        </div>
      ) : (
        <FileInfo fileType={fileType} src={src} />
      )}
    </div>
  );
}
