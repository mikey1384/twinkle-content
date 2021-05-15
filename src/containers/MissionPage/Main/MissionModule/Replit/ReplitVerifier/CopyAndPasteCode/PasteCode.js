import React from 'react';
import PropTypes from 'prop-types';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { cloudFrontURL } from 'constants/defaultValues';

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
      <p>{`1. Tap "pages"`}</p>
      <img
        className={css`
          width: 60%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        style={{ marginTop: '2rem' }}
        src={`${cloudFrontURL}/missions/replit/select-pages-folder.png`}
      />
      <p style={{ marginTop: '5rem' }}>{`2. Tap "index.js"`}</p>
      <img
        style={{ marginTop: '2rem' }}
        className={css`
          width: 60%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        src={`${cloudFrontURL}/missions/replit/select-indexjs.png`}
      />
    </div>
  );
}
