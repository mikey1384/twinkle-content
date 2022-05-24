import React from 'react';
import PropTypes from 'prop-types';
import YouTubeIcon from 'assets/YoutubeIcon.svg';
import { css } from '@emotion/css';

YouTubeThumb.propTypes = {
  style: PropTypes.object,
  thumbUrl: PropTypes.string
};

export default function YouTubeThumb({ style, thumbUrl }) {
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
      >
        <img
          style={{
            width: '6rem',
            height: '4.5rem'
          }}
          src={YouTubeIcon}
        />
      </div>
    </div>
  );
}
