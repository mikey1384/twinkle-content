import React from 'react';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';

export default function CurrentTast() {
  return (
    <div
      className={css`
        font-size: 2.5rem;
        font-weight: bold;
      `}
    >
      Current Task
      <div
        className={css`
          width: 50%;
          font-size: 3rem;
          margin-top: 1rem;
          border: 1px solid ${Color.borderGray()};
          padding: 1rem;
          border-radius: ${borderRadius};
        `}
      >
        Taking a Screen Shot
      </div>
    </div>
  );
}
