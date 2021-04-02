import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

WatchProgressBar.propTypes = {
  percentage: PropTypes.number
};

function WatchProgressBar({ percentage = 0 }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        background: Color.darkerBorderGray()
      }}
    >
      <div
        className={css`
          background: ${Color.red()};
          height: 5px;
          width: ${percentage}%;
          @media (max-width: ${mobileMaxWidth}) {
            height: 3px;
          }
        `}
      />
    </div>
  );
}

export default memo(WatchProgressBar);
