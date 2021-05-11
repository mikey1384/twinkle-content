import React from 'react';
import { borderRadius, Color } from 'constants/css';
import { css } from '@emotion/css';

export default function HighXPSubjects() {
  return (
    <div
      className={css`
        background: #fff;
        font-size: 1.7rem;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        > p {
          font-size: 2rem;
          font-weight: bold;
        }
      `}
    >
      <p>{`Today's High XP Subjects`}</p>
    </div>
  );
}
