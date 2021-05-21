import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import DeleteCode from './DeleteCode';

export default function HelloWorld() {
  const [deletedCode, setDeletedCode] = useState(false);
  return (
    <ErrorBoundary>
      <div
        className={css`
          width: 100%;
          font-size: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          p {
            font-size: 2rem;
            font-weight: bold;
          }
        `}
      >
        {!deletedCode && <DeleteCode onSetDeletedCode={setDeletedCode} />}
      </div>
    </ErrorBoundary>
  );
}
