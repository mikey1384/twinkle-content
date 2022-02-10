import React from 'react';
import { css } from '@emotion/css';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';

export default function MonthItem() {
  return (
    <div
      className={css`
        background: #fff;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
      `}
    >
      <p
        className={css`
          font-size: 2rem;
          font-weight: bold;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.7rem;
          }
        `}
      >
        February
      </p>
      <div style={{ marginTop: '1rem', display: 'flex' }}>Testing</div>
    </div>
  );
}
