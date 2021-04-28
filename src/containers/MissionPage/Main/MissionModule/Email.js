import React from 'react';
import { css } from '@emotion/css';

export default function Email() {
  return (
    <div style={{ width: '100%' }}>
      <p
        className={css`
          width: 100%;
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
        `}
      >
        Type in your email address and tap submit
      </p>
    </div>
  );
}
