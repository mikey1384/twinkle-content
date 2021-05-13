import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';

export default function DidNotPassCopyAndPaste() {
  return (
    <ErrorBoundary
      className={css`
        width: 100%;
        font-size: 1.5rem;
        text-align: center;
        > p {
          font-weight: bold;
          font-size: 1.7rem;
        }
      `}
    >
      <h3>You did not pass the Copy and Paste mission, yet</h3>
    </ErrorBoundary>
  );
}
