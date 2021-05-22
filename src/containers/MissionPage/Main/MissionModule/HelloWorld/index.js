import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import DeleteCode from './DeleteCode';
import CodingHelloWorld from './CodingHelloWorld';

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
        <DeleteCode
          onSetDeletedCode={setDeletedCode}
          deletedCode={deletedCode}
        />
        {deletedCode && (
          <CodingHelloWorld style={{ marginTop: '5rem', width: '100%' }} />
        )}
      </div>
    </ErrorBoundary>
  );
}
