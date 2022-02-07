import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import HighXPSubjects from './HighXPSubjects';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';

export default function Earn() {
  return (
    <ErrorBoundary>
      <section
        className={css`
          @media (max-width: ${mobileMaxWidth}) {
            padding-top: 1rem;
            > h2 {
              padding-left: 1rem;
            }
          }
        `}
      >
        <h2>Earn XP</h2>
        <div style={{ marginTop: '1.3rem' }}>
          <HighXPSubjects />
        </div>
      </section>
    </ErrorBoundary>
  );
}
