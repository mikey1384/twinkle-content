import React from 'react';
import PropTypes from 'prop-types';
import FileIcon from 'components/FileIcon';
import Image from 'components/Image';
import { truncateText } from 'helpers/stringHelpers';

FileContent.propTypes = {
  imageUrl: PropTypes.string,
  file: PropTypes.object.isRequired,
  fileType: PropTypes.string,
  style: PropTypes.object,
  fileIconSize: PropTypes.string,
  fileNameStyle: PropTypes.object,
  fileNameLength: PropTypes.number
};

export default function FileContent({
  imageUrl,
  file,
  fileType,
  style,
  fileIconSize = '3x',
  fileNameStyle = {},
  fileNameLength
}) {
  return (
    <div
      style={{
        width: fileType === 'image' ? '8rem' : '7rem',
        height: '4rem',
        ...style
      }}
    >
      {fileType === 'image' ? (
        <Image imageUrl={imageUrl} />
      ) : (
        <FileIcon size={fileIconSize} fileType={fileType} />
      )}
      <div
        style={{
          textAlign: 'center',
          ...fileNameStyle
        }}
      >
        {truncateText({ text: file.name, limit: fileNameLength || 10 })}
      </div>
    </div>
  );
}
