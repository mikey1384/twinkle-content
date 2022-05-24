import React, { useState } from 'react';
import PropTypes from 'prop-types';
import YouTubeIcon from 'assets/YoutubeIcon.svg';
import { css } from '@emotion/css';
import YTVideoModal from './YTVideoModal';

YouTubeThumb.propTypes = {
  messageId: PropTypes.number.isRequired,
  style: PropTypes.object,
  thumbUrl: PropTypes.string,
  videoUrl: PropTypes.string
};

export default function YouTubeThumb({ messageId, style, thumbUrl, videoUrl }) {
  const [modalShown, setModalShown] = useState(false);
  return (
    <div style={style}>
      <div
        className={`unselectable ${css`
          cursor: pointer;
          background: url(${thumbUrl});
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        `}`}
        src={thumbUrl}
        onClick={() => setModalShown(true)}
      >
        <img
          style={{
            width: '6rem',
            height: '4.5rem'
          }}
          src={YouTubeIcon}
        />
      </div>
      {modalShown && (
        <YTVideoModal
          messageId={messageId}
          url={videoUrl}
          onHide={() => setModalShown(false)}
        />
      )}
    </div>
  );
}
