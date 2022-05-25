import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'components/Image';
import FileIcon from 'components/FileIcon';
import ExtractedThumb from 'components/ExtractedThumb';
import ImageModal from 'components/Modals/ImageModal';
import LocalContext from '../../../Context';
import ErrorBoundary from 'components/ErrorBoundary';
import { cloudFrontURL } from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { v1 as uuidv1 } from 'uuid';
import { css } from '@emotion/css';

FileThumb.propTypes = {
  fileName: PropTypes.string,
  filePath: PropTypes.string,
  fileType: PropTypes.string,
  messageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  thumbUrl: PropTypes.string
};

export default function FileThumb({
  filePath,
  fileName,
  fileType,
  messageId,
  thumbUrl
}) {
  const {
    requests: { uploadThumb }
  } = useContext(LocalContext);
  const src = useMemo(() => {
    if (!filePath) return '';
    return `${cloudFrontURL}/attachments/chat/${filePath}/${encodeURIComponent(
      fileName
    )}`;
  }, [fileName, filePath]);
  const [imageModalShown, setImageModalShown] = useState(false);
  return (
    <ErrorBoundary>
      <div
        className={css`
          color: ${Color.black()};
          cursor: pointer;
          height: 12rem;
          max-width: ${fileType === 'image' ? '12rem' : '15rem'};
          &:hover {
            color: #000;
          }
          @media (max-width: ${mobileMaxWidth}) {
            max-width: ${fileType === 'image' ? '7rem' : '9rem'};
            height: ${fileType === 'image' ? '7rem' : '11rem'};
          }
        `}
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={handleFileClick}
      >
        {fileType === 'image' ? (
          <Image imageUrl={src} />
        ) : fileType === 'video' ? (
          <ExtractedThumb
            src={src}
            style={{ width: '100%', height: '7rem' }}
            thumbUrl={thumbUrl}
            onThumbnailLoad={handleThumbnailLoad}
          />
        ) : (
          <FileIcon size="5x" fileType={fileType} />
        )}
        {fileType !== 'image' && (
          <div
            style={{
              marginTop: '0.5rem',
              textAlign: 'center'
            }}
            className={css`
              font-size: 1.3rem;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 1rem;
              }
            `}
          >
            <p
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
              className={css`
                min-width: 6.5rem;
                @media (max-width: ${mobileMaxWidth}) {
                  min-width: 0;
                }
              `}
            >
              {fileName}
            </p>
            <span>
              <b>Download</b>
            </span>
          </div>
        )}
      </div>
      {imageModalShown && (
        <ImageModal
          onHide={() => setImageModalShown(false)}
          fileName={fileName}
          src={src}
        />
      )}
    </ErrorBoundary>
  );

  function handleFileClick() {
    if (fileType === 'image' && !imageModalShown) {
      return setImageModalShown(true);
    }
    window.open(src);
  }

  function handleThumbnailLoad(thumb) {
    const dataUri = thumb.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataUri, 'base64');
    const file = new File([buffer], 'thumb.png');
    uploadThumb({
      contentType: 'chat',
      contentId: messageId,
      file,
      path: uuidv1()
    });
  }
}
