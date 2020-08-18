import React from 'react';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';
import Screenshot from './screenshot.png';

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
          width: 40%;
          display: flex;
          flex-direction: column;
          font-size: 3rem;
          margin-top: 1rem;
          border: 1px solid ${Color.borderGray()};
          padding: 1rem;
          border-radius: ${borderRadius};
        `}
      >
        <div>Taking a Screen Shot</div>
        <div style={{ marginTop: '2rem', display: 'flex', width: '100%' }}>
          <img
            className={css`
              width: 60%;
            `}
            src={Screenshot}
          />
          <div
            className={css`
              width: 40%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 2rem;
            `}
          >
            progress: 60%
          </div>
        </div>
      </div>
    </div>
  );
}
