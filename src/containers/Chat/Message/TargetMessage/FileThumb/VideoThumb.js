import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ExtractedThumb from 'components/ExtractedThumb';
import LocalContext from '../../../Context';
import playButtonImg from 'assets/play-button-image.png';
import ErrorBoundary from 'components/ErrorBoundary';
import { v1 as uuidv1 } from 'uuid';

VideoThumb.propTypes = {
  messageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  thumbUrl: PropTypes.string,
  src: PropTypes.string
};
export default function VideoThumb({ messageId, thumbUrl, src }) {
  const {
    requests: { uploadThumb }
  } = useContext(LocalContext);

  return (
    <ErrorBoundary>
      <div
        style={{
          width: '100%',
          height: '7rem',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <ExtractedThumb
          style={{ width: '100%', height: '100%' }}
          src={src}
          thumbUrl={thumbUrl}
          onThumbnailLoad={handleThumbnailLoad}
          onClick={() => console.log('clicked')}
        />
        <img
          style={{
            top: 'CALC(50% - 1.5rem)',
            left: 'CALC(50% - 1.5rem)',
            position: 'absolute',
            width: '3rem',
            height: '3rem'
          }}
          src={playButtonImg}
        />
      </div>
    </ErrorBoundary>
  );

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
