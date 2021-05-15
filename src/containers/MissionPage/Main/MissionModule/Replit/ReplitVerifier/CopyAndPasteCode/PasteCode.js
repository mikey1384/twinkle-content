import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { cloudFrontURL } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';

PasteCode.propTypes = {
  style: PropTypes.object
};

export default function PasteCode({ style }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        ...style
      }}
    >
      <p>{`Follow along this video`}</p>
      <div
        className={css`
          width: 70%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <div
          className="unselectable"
          style={{
            width: '100%',
            paddingTop: '57.25%',
            position: 'relative'
          }}
        >
          <ReactPlayer
            width="100%"
            height="100%"
            style={{
              marginTop: '1rem',
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0
            }}
            url={`${cloudFrontURL}/missions/replit/video-instruction.mp4`}
            controls
          />
        </div>
      </div>
    </div>
  );
}
