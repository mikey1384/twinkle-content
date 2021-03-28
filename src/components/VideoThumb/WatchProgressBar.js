import React from 'react';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

export default function WatchProgressBar() {
  return (
    <div style={{ position: 'absolute', width: '100%', bottom: 0 }}>
      <div
        className={css`
          background: ${Color.red()};
          height: 5px;
          width: 100%;
          @media (max-width: ${mobileMaxWidth}) {
            height: 3px;
          }
        `}
      />
    </div>
  );
}
