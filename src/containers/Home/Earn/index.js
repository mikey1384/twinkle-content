import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { borderRadius, Color } from 'constants/css';
import { css } from '@emotion/css';

export default function Earn() {
  return (
    <ErrorBoundary>
      <div
        className={css`
          background: #fff;
          font-size: 1.7rem;
          padding: 1rem;
          border: 1px solid ${Color.borderGray()};
          border-radius: ${borderRadius};
        `}
      >
        this is earn section
      </div>
    </ErrorBoundary>
  );
}
